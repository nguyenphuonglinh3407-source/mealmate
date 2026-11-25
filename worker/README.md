# Hướng Dẫn Triển Khai Cloudflare Worker cho MealMate AI

Tài liệu hướng dẫn từng bước thiết lập và triển khai Cloudflare Worker làm máy chủ proxy bảo mật giữa giao diện web MealMate và Google Gemini API.

---

## 1. Giới thiệu kiến trúc
Cloudflare Worker đóng vai trò như một lá chắn bảo mật:
- **Bảo mật API Key:** Giữ bí mật `GEMINI_API_KEY` hoàn toàn ở backend trên Cloudflare, không bao giờ lộ ra trình duyệt của người dùng.
- **Kiểm soát CORS:** Chỉ cho phép trang web chính thức (`https://nguyenphuonglinh3407-source.github.io`) và môi trường chạy thử cục bộ (`http://localhost:3000`).
- **Giới hạn tần suất (Rate Limiting):** Tự động chặn các yêu cầu spam liên tục theo từng địa chỉ IP.
- **Xác thực và nén ảnh:** Chỉ tiếp nhận ảnh định dạng `image/jpeg` hoặc `image/png` với dung lượng an toàn.
- **Chuẩn hóa cấu trúc JSON:** Bắt buộc Gemini API phản hồi chuẩn định dạng JSON schema để giao diện hiển thị ngay lập tức.

---

## 2. Các bước triển khai chi tiết

### Bước 1: Mở Terminal tại thư mục `worker`
Mở PowerShell hoặc Command Prompt và di chuyển vào thư mục `worker`:
```bash
cd C:\Users\Admin\.gemini\antigravity\scratch\gap-gi-an-nay\worker
```

### Bước 2: Đăng nhập vào tài khoản Cloudflare
Nếu máy tính của bạn chưa cài đặt Wrangler hoặc chưa đăng nhập Cloudflare, hãy chạy lệnh:
```bash
npx wrangler login
```
*Trình duyệt sẽ tự động mở trang web Cloudflare. Bạn chỉ cần nhấn nút **Allow** (Cho phép) để cấp quyền cho Wrangler.*

### Bước 3: Đưa khóa bảo mật `GEMINI_API_KEY` lên Cloudflare Secret
Chạy lệnh sau trong thư mục `worker`:
```bash
npx wrangler secret put GEMINI_API_KEY
```
- Khi terminal hiện dòng nhắc: `Enter a secret value:`, hãy dán (paste) API key của Google Gemini vào và nhấn `Enter`.
- Khóa này sẽ được mã hóa và lưu trữ an toàn trong Secret Vault của Cloudflare, tuyệt đối không lưu trong file mã nguồn.

### Bước 4: Triển khai (Deploy) Worker lên Cloudflare
Chạy lệnh deploy:
```bash
npx wrangler deploy
```
Sau khi hoàn tất, terminal sẽ hiển thị địa chỉ công khai của Worker, ví dụ:
```text
Deployed mealmate-ai-worker to https://mealmate-ai-worker.<ten-tai-khoan>.workers.dev
```

### Bước 5: Cập nhật địa chỉ Worker vào Front-end MealMate
1. Mở file `js/fridge.js`.
2. Điền đường dẫn vừa nhận được vào hằng số `API_URL` ở đầu file:
```javascript
const API_URL = "https://mealmate-ai-worker.<ten-tai-khoan>.workers.dev";
```
3. Lưu file lại. Giờ đây tính năng **Tủ Lạnh Thần Kỳ** đã kết nối trực tiếp với backend Cloudflare Worker và Gemini AI!

---

## 3. Chạy thử nghiệm cục bộ (Local Development)
Nếu muốn chạy thử Worker trên máy tính trước khi deploy:
1. Tạo một file `.dev.vars` bên trong thư mục `worker/` (file này đã được thêm vào `.gitignore` để tránh bị commit):
```ini
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
2. Chạy lệnh:
```bash
npx wrangler dev
```
Worker sẽ khởi chạy tại `http://localhost:8787`. Bạn có thể đặt `const API_URL = "http://localhost:8787"` trong `js/fridge.js` để test nội bộ.

---

## 4. Các điểm cuối API (Endpoints)

### `POST /detect`
- **Mục đích:** Nhận diện nguyên liệu trong tủ lạnh từ ảnh.
- **Body:** `{ "image": "data:image/jpeg;base64,..." }`
- **Output:** `{ "success": true, "hasFood": true, "ingredients": ["Trứng gà", "Cà chua", ...], "message": "..." }`

### `POST /suggest`
- **Mục đích:** Gợi ý từ 3 đến 5 món ăn nấu được từ nguyên liệu có sẵn.
- **Body:** `{ "ingredients": ["Trứng gà", "Cà chua"], "servings": 2, "vegetarian": false }`
- **Output:** `{ "success": true, "recipes": [ ... ] }`
