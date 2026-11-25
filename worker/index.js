/**
 * CLOUDFLARE WORKER - MEALMATE AI BACKEND PROXY
 * 
 * Máy chủ trung gian kết nối giữa ứng dụng web MealMate và Google Gemini API
 * Bảo mật API key, kiểm soát CORS, giới hạn tần suất, xác thực ảnh và chuẩn hóa JSON.
 */

// Tên model Gemini có thể thay đổi linh hoạt (dễ dàng đổi sang gemini-2.5-flash nếu cần)
const GEMINI_MODEL = "gemini-3.5-flash";

// Danh sách Origin được phép truy cập (CORS)
const ALLOWED_ORIGINS = [
  "https://nguyenphuonglinh3407-source.github.io",
  "http://localhost:3000"
];

// Cấu hình giới hạn tần suất (Rate Limiting) theo IP: tối đa 20 yêu cầu / phút
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;
const ipRequestHistory = new Map();

/**
 * Kiểm tra và ghi nhận tần suất gọi của một địa chỉ IP
 * @param {string} ip 
 * @returns {boolean} True nếu trong ngưỡng cho phép, False nếu vượt quá
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = ipRequestHistory.get(ip) || [];

  // Lọc bỏ các mốc thời gian ngoài cửa sổ theo dõi
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestHistory.set(ip, recent);
    return false;
  }

  recent.push(now);
  ipRequestHistory.set(ip, recent);

  // Dọn dẹp bộ nhớ định kỳ tránh phình to
  if (ipRequestHistory.size > 2000) {
    for (const [key, list] of ipRequestHistory.entries()) {
      const active = list.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        ipRequestHistory.delete(key);
      } else {
        ipRequestHistory.set(key, active);
      }
    }
  }

  return true;
}

/**
 * Tạo header CORS theo Origin hợp lệ
 * @param {string|null} origin 
 * @returns {object|null}
 */
function getCorsHeaders(origin) {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      "Vary": "Origin"
    };
  }
  return null;
}

/**
 * Trả về phản hồi JSON chuẩn hóa kèm header CORS
 */
function jsonResponse(data, status = 200, corsHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    const corsHeaders = getCorsHeaders(origin);

    // 1. Xử lý preflight request (OPTIONS)
    if (request.method === "OPTIONS") {
      if (!corsHeaders) {
        return new Response("CORS Forbidden", { status: 403 });
      }
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // 2. Kiểm tra quyền truy cập Origin (CORS)
    if (!corsHeaders) {
      return jsonResponse({
        success: false,
        error: "Truy cập bị từ chối: Nguồn gốc trang web (Origin) không nằm trong danh sách cho phép."
      }, 403);
    }

    // 3. Giới hạn tần suất gọi API theo IP người dùng
    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown-ip";
    if (!checkRateLimit(clientIP)) {
      return jsonResponse({
        success: false,
        error: "Bạn ơi thao tác từ từ thôi kẻo AI bốc khói! Đợi khoảng 1 phút rồi thử lại nhé 🥵"
      }, 429, corsHeaders);
    }

    // 4. Kiểm tra cấu hình API Key từ Secret
    if (!env.GEMINI_API_KEY) {
      return jsonResponse({
        success: false,
        error: "Máy chủ chưa cấu hình GEMINI_API_KEY trong Secret của Cloudflare Worker."
      }, 500, corsHeaders);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // Chỉ chấp nhận phương thức POST cho các API xử lý
    if (request.method !== "POST") {
      return jsonResponse({
        success: false,
        error: "Phương thức không được hỗ trợ. Vui lòng dùng POST."
      }, 405, corsHeaders);
    }

    try {
      // ======================================================================
      // ĐƯỜNG DẪN 1: POST /detect (hoặc alias /api/scan-fridge)
      // Nhận ảnh base64, nhận diện nguyên liệu trong tủ lạnh
      // ======================================================================
      if (pathname === "/detect" || pathname === "/api/scan-fridge") {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: "Dữ liệu JSON gửi lên không hợp lệ!" }, 400, corsHeaders);
        }

        const rawImage = body.image;
        if (!rawImage || typeof rawImage !== "string") {
          return jsonResponse({ success: false, error: "Thiếu dữ liệu ảnh (image base64)!" }, 400, corsHeaders);
        }

        // Tách MIME type và dữ liệu Base64
        let mimeType = "image/jpeg";
        let base64Data = rawImage;

        const match = rawImage.match(/^data:(image\/[a-zA-Z0-9\+\-]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1].toLowerCase();
          base64Data = match[2];
        }

        // Kiểm tra loại ảnh: chỉ chấp nhận image/jpeg và image/png
        if (mimeType !== "image/jpeg" && mimeType !== "image/png") {
          return jsonResponse({
            success: false,
            error: "Định dạng ảnh không được hỗ trợ! Chỉ chấp nhận ảnh image/jpeg hoặc image/png."
          }, 400, corsHeaders);
        }

        // Giới hạn kích thước ảnh (tối đa ~6MB chuỗi base64)
        if (base64Data.length > 8 * 1024 * 1024) {
          return jsonResponse({
            success: false,
            error: "Ảnh quá lớn! Vui lòng nén ảnh nhỏ hơn 5MB trước khi gửi."
          }, 400, corsHeaders);
        }

        // Gọi Gemini REST API với JSON Schema ép buộc
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

        const payload = {
          systemInstruction: {
            parts: [
              {
                text: `Bạn là trợ lý đầu bếp AI hóm hỉnh, am hiểu ẩm thực Việt Nam của ứng dụng MealMate.
Nhiệm vụ: Soi bức ảnh chụp tủ lạnh hoặc nguyên liệu nấu ăn được gửi đến.
1. Xác định bức ảnh có chứa thực phẩm, đồ ăn, đồ uống hay nguyên liệu nấu nướng không (hasFood).
2. Nếu có (hasFood = true): Liệt kê tên các nguyên liệu nhận diện được bằng tiếng Việt chuẩn, ngắn gọn (ví dụ: "Trứng gà", "Cà chua", "Đậu phụ", "Thịt ba chỉ", "Hành lá", "Nước mắm"...).
3. Viết 1 câu nhận xét hài hước, hóm hỉnh bằng tiếng Việt về tình trạng thực phẩm này (message).
4. Nếu ảnh KHÔNG chứa đồ ăn hoặc nguyên liệu nấu nướng (ví dụ chụp phong cảnh, người, đồ đạc, kệ sách...): Đặt hasFood = false, mảng ingredients = [], và đưa ra câu nhận xét trêu đùa vui vẻ nhắc người dùng chụp đúng tủ lạnh.`
              }
            ]
          },
          contents: [
            {
              parts: [
                { text: "Hãy soi kỹ bức ảnh này và phân loại nguyên liệu thực phẩm có bên trong." },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                hasFood: {
                  type: "BOOLEAN",
                  description: "True nếu ảnh có thực phẩm/đồ ăn/nguyên liệu, False nếu không có"
                },
                ingredients: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  description: "Danh sách tên nguyên liệu thực phẩm bằng tiếng Việt"
                },
                message: {
                  type: "STRING",
                  description: "Một câu nhận xét hài hước về tình trạng tủ lạnh"
                }
              },
              required: ["hasFood", "ingredients", "message"]
            }
          }
        };

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!geminiRes.ok) {
          return jsonResponse({
            success: false,
            error: `Đầu bếp AI đang bận (${geminiRes.status}). Vui lòng thử lại sau giây lát!`
          }, 502, corsHeaders);
        }

        const geminiData = await geminiRes.json();
        const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidateText) {
          return jsonResponse({
            success: false,
            error: "Không nhận được phản hồi hợp lệ từ mô hình AI."
          }, 500, corsHeaders);
        }

        const parsedResult = JSON.parse(candidateText);

        // Trường hợp không có thực phẩm trong ảnh
        if (!parsedResult.hasFood || !parsedResult.ingredients || parsedResult.ingredients.length === 0) {
          return jsonResponse({
            success: true,
            hasFood: false,
            ingredients: [],
            message: parsedResult.message || "Không thấy đồ ăn đâu cả, bạn có chụp nhầm tủ quần áo hay kệ sách không đấy? 🧐"
          }, 200, corsHeaders);
        }

        return jsonResponse({
          success: true,
          hasFood: true,
          ingredients: parsedResult.ingredients,
          message: parsedResult.message || `Đã soi thấy ${parsedResult.ingredients.length} nguyên liệu ngon lành!`
        }, 200, corsHeaders);
      }

      // ======================================================================
      // ĐƯỜNG DẪN 2: POST /suggest (hoặc alias /api/suggest-recipes)
      // Nhận danh sách nguyên liệu, số người ăn, chế độ chay -> Gợi ý 3 đến 5 món
      // ======================================================================
      if (pathname === "/suggest" || pathname === "/api/suggest-recipes") {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ success: false, error: "Dữ liệu JSON gửi lên không hợp lệ!" }, 400, corsHeaders);
        }

        const ingredients = Array.isArray(body.ingredients) ? body.ingredients.filter(Boolean) : [];
        const servings = parseInt(body.servings, 10) || 2;
        const vegetarian = Boolean(body.vegetarian);

        if (ingredients.length === 0) {
          return jsonResponse({
            success: false,
            error: "Danh sách nguyên liệu rỗng! Hãy nhập ít nhất 1-2 nguyên liệu để đầu bếp trổ tài nhé."
          }, 400, corsHeaders);
        }

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;

        const payload = {
          systemInstruction: {
            parts: [
              {
                text: `Bạn là bếp trưởng kỳ cựu của MealMate, vừa am hiểu dinh dưỡng vừa có tính cách vui nhộn, ấm áp.
Nhiệm vụ: Gợi ý 3 đến 5 món ăn ngon miệng có thể nấu được từ nguyên liệu người dùng cung cấp.
Quy tắc bắt buộc:
1. Độ chính xác & An toàn: Công thức nấu ăn phải thực tế, ăn được, chuẩn vị và an toàn vệ sinh thực phẩm.
2. Ăn chay: Nếu vegetarian = true, TUYỆT ĐỐI KHÔNG gợi ý món có thịt, cá, tôm, hải sản, mắm tôm hay mỡ động vật.
3. Số người ăn: Điều chỉnh khẩu phần và bước nấu phù hợp với số người ăn được yêu cầu.
4. Mỗi món phải có:
   - id: Chuỗi id duy nhất (ví dụ: "m1", "m2"...)
   - name: Tên món ăn bằng tiếng Việt chuẩn
   - emoji: 1 emoji đại diện phù hợp nhất
   - time: Thời gian nấu ước tính (ví dụ: "15 phút", "25 phút")
   - difficulty: "Dễ", "Vừa" hoặc "Khó"
   - vegetarian: boolean (true nếu là món chay)
   - missingIngredients: Mảng các nguyên liệu gia vị hoặc đồ kèm quan trọng còn thiếu người dùng cần mua thêm (nếu đủ thì để mảng rỗng [])
   - steps: Mảng 3 đến 4 bước nấu ngắn gọn, rõ ràng, dễ làm
   - comment: Một câu bình luận dí dỏm, hài hước về món ăn này.`
              }
            ]
          },
          contents: [
            {
              parts: [
                {
                  text: `Tôi có các nguyên liệu sau trong tủ: ${ingredients.join(", ")}.
Số người ăn: ${servings} người.
Chế độ ăn: ${vegetarian ? "Ăn chay thanh tịnh (hoàn toàn không thịt cá)" : "Ăn mặn bình thường (có thể dùng thịt cá)"}.
Hãy gợi ý cho tôi 3 đến 5 món ăn phù hợp và thơm ngon nhất!`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                recipes: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      id: { type: "STRING" },
                      name: { type: "STRING" },
                      emoji: { type: "STRING" },
                      time: { type: "STRING" },
                      difficulty: { type: "STRING", enum: ["Dễ", "Vừa", "Khó"] },
                      vegetarian: { type: "BOOLEAN" },
                      missingIngredients: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                      },
                      steps: {
                        type: "ARRAY",
                        items: { type: "STRING" }
                      },
                      comment: { type: "STRING" }
                    },
                    required: ["id", "name", "emoji", "time", "difficulty", "vegetarian", "missingIngredients", "steps", "comment"]
                  }
                }
              },
              required: ["recipes"]
            }
          }
        };

        const geminiRes = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!geminiRes.ok) {
          return jsonResponse({
            success: false,
            error: `Đầu bếp AI đang bận (${geminiRes.status}). Vui lòng thử lại sau giây lát!`
          }, 502, corsHeaders);
        }

        const geminiData = await geminiRes.json();
        const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!candidateText) {
          return jsonResponse({
            success: false,
            error: "Không nhận được phản hồi công thức từ mô hình AI."
          }, 500, corsHeaders);
        }

        const parsedResult = JSON.parse(candidateText);

        return jsonResponse({
          success: true,
          recipes: parsedResult.recipes || []
        }, 200, corsHeaders);
      }

      // Endpoint không tìm thấy
      return jsonResponse({
        success: false,
        error: "Đường dẫn không tồn tại. Chỉ hỗ trợ POST /detect và POST /suggest."
      }, 404, corsHeaders);

    } catch (err) {
      // Báo lỗi tổng quát, tuyệt đối không in nội dung ảnh hoặc lộ API key
      return jsonResponse({
        success: false,
        error: "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau!"
      }, 500, corsHeaders);
    }
  }
};
