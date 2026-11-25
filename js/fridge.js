/**
 * TỦ LẠNH THẦN KỲ (MAGIC FRIDGE AI)
 * File: js/fridge.js
 * 
 * Logic giao diện và xử lý phía trình duyệt:
 * - Chọn / chụp ảnh tủ lạnh, kéo thả ảnh trên máy tính.
 * - Kiểm tra dung lượng (tối đa 8MB) và định dạng ảnh.
 * - Nén ảnh bằng Canvas (cạnh dài tối đa 1024px, JPEG 0.8) trước khi gửi.
 * - Bước 1: Nhận diện nguyên liệu, hiển thị dạng chip pastel, cho phép thêm/xóa.
 * - Bước 2: Gợi ý 3 - 5 món ăn phù hợp theo số người ăn và tùy chọn chay/mặn.
 * - Hiệu ứng chờ với các câu nói hài hước xoay vòng.
 */

// ============================================================================
// CẤU HÌNH API
// ============================================================================
// Địa chỉ backend AI (để trống nếu đang dùng mock data để thử nghiệm giao diện)
// Lưu ý: Tuyệt đối KHÔNG nhúng API key trực tiếp vào mã nguồn front-end!
const API_URL = "";

// ============================================================================
// DỮ LIỆU GIẢ LẬP (MOCK DATA) PHỤC VỤ THỬ NGHIỆM GIAO DIỆN
// ============================================================================
const MOCK_SCAN_INGREDIENTS = [
  "Trứng gà",
  "Cà chua",
  "Đậu phụ",
  "Hành lá",
  "Tỏi",
  "Thịt ba chỉ",
  "Cơm nguội",
  "Nước mắm"
];

const MOCK_RECIPES_DATABASE = [
  {
    id: "r1",
    name: "Đậu phụ sốt cà chua hành hoa",
    emoji: "🍲",
    time: "15 phút",
    difficulty: "Dễ",
    vegetarian: true,
    missingIngredients: [],
    steps: [
      "Đậu phụ cắt miếng vuông vừa ăn, rán sơ cho vàng các mặt.",
      "Phi thơm hành khô với cà chua băm nhuyễn, thêm chút nước và gia vị thành sốt sệt.",
      "Cho đậu rán vào rim nhỏ lửa 5 phút cho ngấm sốt, rắc hành lá cắt nhỏ rồi tắt bếp."
    ],
    comment: "Món ăn quốc dân giản dị nhưng hao cơm khủng khiếp, sinh viên hay đại gia đều mê!"
  },
  {
    id: "r2",
    name: "Thịt ba chỉ rang cháy cạnh tỏi ớt",
    emoji: "🥓",
    time: "20 phút",
    difficulty: "Dễ",
    vegetarian: false,
    missingIngredients: ["Ớt tươi"],
    steps: [
      "Thịt ba chỉ thái mỏng vừa ăn, ướp chút hành tỏi băm và hạt nêm.",
      "Đảo thịt trên chảo nóng cho săn lại và tứa bớt mỡ vàng óng.",
      "Pha nước mắm đường tiêu rưới vào đảo nhanh tay đến khi sốt keo bám bóng bẩy."
    ],
    comment: "Thơm nức mũi cả xóm, nhớ cắm thêm một nồi cơm nữa kẻo thiếu nhé!"
  },
  {
    id: "r3",
    name: "Cơm chiên trứng tỏi vàng giòn hạt",
    emoji: "🍳",
    time: "12 phút",
    difficulty: "Dễ",
    vegetarian: true,
    missingIngredients: [],
    steps: [
      "Trộn đều cơm nguội với 1 lòng đỏ trứng gà để hạt cơm có màu vàng ruộm.",
      "Phi thơm tỏi băm nhiều với chút dầu ăn, cho cơm vào đảo đều tay trên lửa lớn.",
      "Khi hạt cơm săn giòn rụm thì nêm nước mắm tiêu và rắc hành hoa rồi thưởng thức."
    ],
    comment: "Giải cứu cơm nguội thừa một cách thần thánh, giòn tan vui tai ăn hoài không ngán."
  },
  {
    id: "r4",
    name: "Canh cà chua trứng mây đậu hũ thanh mát",
    emoji: "🥣",
    time: "10 phút",
    difficulty: "Dễ",
    vegetarian: true,
    missingIngredients: [],
    steps: [
      "Xào mềm cà chua với chút dầu ăn cho ra màu đỏ đẹp mắt, thêm nước đun sôi.",
      "Cho đậu phụ cắt hạt lựu vào nấu sôi lăn tăn.",
      "Đánh tan trứng gà, vừa đổ từ từ vào nồi vừa khuấy nhẹ tạo vân mây, rắc hành ngò thơm lừng."
    ],
    comment: "Nước canh chua ngọt dịu mát, vừa dễ nuốt vừa giải nhiệt sau ngày dài học tập."
  },
  {
    id: "r5",
    name: "Thịt ba chỉ kho trứng cút đậm đà",
    emoji: "🥘",
    time: "35 phút",
    difficulty: "Vừa",
    vegetarian: false,
    missingIngredients: ["Nước dừa tươi"],
    steps: [
      "Thịt ba chỉ thái con chì, ướp hành tỏi, nước mắm, tiêu và đường thắng màu cánh gián.",
      "Luộc chín trứng, bóc vỏ và khía nhẹ quanh thân.",
      "Cho thịt và trứng vào nồi xào săn, thêm nước ngập mặt rồi kho liu riu cho mềm rục."
    ],
    comment: "Đậm vị tuổi thơ mẹ nấu, cắn miếng thịt mỡ trong veo tan ngay đầu lưỡi."
  }
];

// Các câu thoại vui nhộn xoay vòng khi đang soi tủ lạnh
const SCAN_FUNNY_MESSAGES = [
  "Đang lục lọi từng ngóc ngách trong tủ lạnh... 🔍",
  "Hỏi ý kiến bà ngoại AI xem có gì ngon... 👵",
  "Ngửi thử xem quả trứng này còn tươi không... 🥚",
  "Đếm xem còn mấy tép tỏi và củ hành héo... 🧄",
  "Đang soi hạn sử dụng mấy hộp gia vị bí ẩn... 🥫",
  "Phát hiện một mẩu phô mai nằm im từ tuần trước... 🧀"
];

// Các câu thoại vui nhộn xoay vòng khi đang tìm công thức
const SUGGEST_FUNNY_MESSAGES = [
  "Đang lật sổ tay đầu bếp Michelin... 👨‍🍳",
  "Suy nghĩ công thức vừa ngon vừa lười nhất quả đất... 🍲",
  "Tính toán lượng calo để ăn no mà không béo... ⚖️",
  "Đang triệu hồi thần bếp núc nhập vào bạn... ✨",
  "Đang cân đối gia vị cho bữa ăn ấm cúng... 🧂",
  "Công thức sắp ra lò rồi, chuẩn bị xoong chảo thôi! 🍳"
];

// ============================================================================
// TRẠNG THÁI NỘI BỘ (FRIDGE STATE)
// ============================================================================
const fridgeState = {
  selectedFile: null,
  resizedBase64: null,
  ingredients: [],
  onlyVegetarian: false,
  servings: 2,
  isScanning: false,
  isSuggesting: false,
  loadingInterval: null
};

// ============================================================================
// HÀM TIỆN ÍCH NÉN ẢNH (CANVAS RESIZE)
// ============================================================================

/**
 * Nén và thu nhỏ ảnh bằng Canvas:
 * - Cạnh dài nhất tối đa 1024px
 * - Định dạng JPEG với chất lượng 0.8
 * @param {File} file 
 * @returns {Promise<{base64: string, width: number, height: number, sizeKB: number}>}
 */
export function resizeImage(file) {
  return new Promise((resolve, reject) => {
    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith("image/")) {
      reject(new Error("Chỉ nhận file ảnh (PNG, JPG, WEBP...) thôi nè, đừng gửi file lạ nha bạn ơi! 📂❌"));
      return;
    }

    // Kiểm tra dung lượng tối đa 8MB
    const MAX_RAW_SIZE = 8 * 1024 * 1024;
    if (file.size > MAX_RAW_SIZE) {
      reject(new Error("Ối dồi ôi! Tủ lạnh nhà bạn to quá hay sao mà ảnh tận hơn 8MB lận? Nén bớt lại hoặc chọn ảnh gọn gàng hơn nhé! 🐘"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Không thể đọc được file ảnh này, bạn thử chọn tấm khác xem sao nhé! 😢"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("File ảnh bị lỗi hoặc không hiển thị được!"));
      img.onload = () => {
        let { width, height } = img;
        const maxDim = 1024;

        // Tính tỉ lệ thu nhỏ
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const quality = 0.8;
        const base64 = canvas.toDataURL("image/jpeg", quality);
        const sizeKB = Math.round((base64.length * 3) / 4 / 1024);

        resolve({ base64, width, height, sizeKB });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================================
// KHỞI TẠO VÀ BINDING DOM
// ============================================================================

export function initFridge() {
  const fileInput = document.getElementById("fridge-file-input");
  const dropzone = document.getElementById("fridge-dropzone");
  const dropzoneContent = document.getElementById("dropzone-content");
  const imagePreviewWrap = document.getElementById("image-preview-wrap");
  const previewImg = document.getElementById("preview-img");
  const previewInfo = document.getElementById("preview-info");
  const btnChangeImage = document.getElementById("btn-change-image");
  const btnScan = document.getElementById("btn-scan-fridge");

  const chipsContainer = document.getElementById("ingredients-chips");
  const inputManual = document.getElementById("input-ingredient-manual");
  const btnAddManual = document.getElementById("btn-add-ingredient");

  const vegSwitch = document.getElementById("fridge-veg-switch");
  const servingsValue = document.getElementById("servings-value");
  const btnStepMinus = document.getElementById("btn-step-minus");
  const btnStepPlus = document.getElementById("btn-step-plus");
  const btnSuggest = document.getElementById("btn-suggest-recipes");

  const loadingBox = document.getElementById("fridge-loading-box");
  const loadingFunnyText = document.getElementById("loading-funny-text");
  const errorBox = document.getElementById("fridge-error-box");
  const errorMessage = document.getElementById("error-message");
  const btnRetry = document.getElementById("btn-retry");

  const recipesContainer = document.getElementById("suggested-recipes-container");
  const recipesGrid = document.getElementById("recipes-grid");
  const recipesCountBadge = document.getElementById("recipes-count-badge");

  if (!dropzone || !fileInput) return;

  // 1. Kéo thả file ảnh
  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  // Bấm vào dropzone để mở file explorer / camera
  dropzone.addEventListener("click", (e) => {
    if (e.target !== btnChangeImage && !imagePreviewWrap.contains(e.target)) {
      fileInput.click();
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  btnChangeImage.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.value = "";
    fileInput.click();
  });

  /**
   * Xử lý file ảnh được chọn
   */
  async function handleFileSelected(file) {
    hideError();
    try {
      const resized = await resizeImage(file);
      fridgeState.selectedFile = file;
      fridgeState.resizedBase64 = resized.base64;

      // Cập nhật giao diện xem trước
      previewImg.src = resized.base64;
      previewInfo.textContent = `Đã tối ưu: ${resized.width}x${resized.height}px (~${resized.sizeKB} KB)`;
      
      dropzoneContent.style.display = "none";
      imagePreviewWrap.style.display = "flex";
      btnScan.disabled = false;
    } catch (err) {
      showError(err.message);
      fileInput.value = "";
      btnScan.disabled = true;
    }
  }

  // 2. Nút "Soi tủ lạnh" (Bước 1)
  btnScan.addEventListener("click", async () => {
    if (!fridgeState.resizedBase64 || fridgeState.isScanning) return;

    fridgeState.isScanning = true;
    btnScan.disabled = true;
    hideError();
    startFunnyLoading(SCAN_FUNNY_MESSAGES);

    try {
      let ingredientsResult = [];

      if (API_URL && API_URL.trim() !== "") {
        // Gửi ảnh tới Backend AI thực tế
        const response = await fetch(`${API_URL}/api/scan-fridge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: fridgeState.resizedBase64 })
        });

        if (!response.ok) {
          throw new Error(`Máy chủ báo lỗi (${response.status}): Tủ lạnh hơi tối, AI nhìn chưa rõ!`);
        }
        const data = await response.json();
        ingredientsResult = data.ingredients || [];
      } else {
        // Dùng dữ liệu giả lập (Mock) với độ trễ 1.5s
        await new Promise(r => setTimeout(r, 1600));
        ingredientsResult = [...MOCK_SCAN_INGREDIENTS];
      }

      fridgeState.ingredients = ingredientsResult;
      renderIngredientsChips();
      btnSuggest.disabled = fridgeState.ingredients.length === 0;

    } catch (err) {
      console.error("Lỗi khi soi tủ lạnh:", err);
      showError(err.message || "Tủ lạnh có vẻ hơi tối hoặc ảnh bị mờ. Hãy thử chụp góc sáng hơn nhé! 💡");
    } finally {
      stopFunnyLoading();
      fridgeState.isScanning = false;
      btnScan.disabled = false;
    }
  });

  // 3. Quản lý Chips nguyên liệu
  function renderIngredientsChips() {
    chipsContainer.innerHTML = "";

    if (fridgeState.ingredients.length === 0) {
      chipsContainer.innerHTML = `<span class="empty-chips-hint">Tủ lạnh đang trống trơn! Hãy soi ảnh hoặc nhập thêm vài món bên dưới nhé! 🥗</span>`;
      btnSuggest.disabled = true;
      return;
    }

    btnSuggest.disabled = false;

    fridgeState.ingredients.forEach((ing, index) => {
      const chip = document.createElement("span");
      chip.className = "ingredient-chip";
      chip.innerHTML = `
        <span class="chip-name">${ing}</span>
        <button type="button" class="chip-remove-btn" data-index="${index}" title="Xóa nguyên liệu này" aria-label="Xóa ${ing}">✕</button>
      `;
      chipsContainer.appendChild(chip);
    });

    // Bắt sự kiện xóa từng chip
    chipsContainer.querySelectorAll(".chip-remove-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        fridgeState.ingredients.splice(idx, 1);
        renderIngredientsChips();
      });
    });
  }

  // Thêm nguyên liệu thủ công
  function addManualIngredient() {
    const val = inputManual.value.trim();
    if (!val) return;

    // Không thêm trùng lặp
    if (!fridgeState.ingredients.some(i => i.toLowerCase() === val.toLowerCase())) {
      fridgeState.ingredients.push(val);
      renderIngredientsChips();
    }
    inputManual.value = "";
    inputManual.focus();
  }

  btnAddManual.addEventListener("click", addManualIngredient);
  inputManual.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addManualIngredient();
    }
  });

  // 4. Tùy chọn Bước 2: Chay/Mặn & Số người ăn
  vegSwitch.addEventListener("change", (e) => {
    fridgeState.onlyVegetarian = e.target.checked;
  });

  btnStepMinus.addEventListener("click", () => {
    if (fridgeState.servings > 1) {
      fridgeState.servings--;
      servingsValue.textContent = fridgeState.servings;
    }
  });

  btnStepPlus.addEventListener("click", () => {
    if (fridgeState.servings < 10) {
      fridgeState.servings++;
      servingsValue.textContent = fridgeState.servings;
    }
  });

  // 5. Nút "Gợi ý món" (Bước 2)
  btnSuggest.addEventListener("click", async () => {
    if (fridgeState.ingredients.length === 0 || fridgeState.isSuggesting) return;

    fridgeState.isSuggesting = true;
    btnSuggest.disabled = true;
    hideError();
    recipesContainer.style.display = "none";
    startFunnyLoading(SUGGEST_FUNNY_MESSAGES);

    try {
      let recipesResult = [];

      if (API_URL && API_URL.trim() !== "") {
        // Gọi API backend AI
        const response = await fetch(`${API_URL}/api/suggest-recipes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ingredients: fridgeState.ingredients,
            vegetarian: fridgeState.onlyVegetarian,
            servings: fridgeState.servings
          })
        });

        if (!response.ok) {
          throw new Error(`Đầu bếp AI đang bận (${response.status}), xin vui lòng thử lại sau giây lát!`);
        }
        const data = await response.json();
        recipesResult = data.recipes || [];
      } else {
        // Dùng dữ liệu giả lập (Mock) phù hợp với bộ lọc Chay/Mặn
        await new Promise(r => setTimeout(r, 1800));
        
        let filtered = MOCK_RECIPES_DATABASE;
        if (fridgeState.onlyVegetarian) {
          filtered = filtered.filter(r => r.vegetarian);
        }
        recipesResult = filtered.slice(0, 4);
      }

      renderRecipes(recipesResult);

    } catch (err) {
      console.error("Lỗi khi gợi ý món:", err);
      showError(err.message || "Đầu bếp AI vừa đánh rơi chảo! Hãy bấm thử lại phát nữa nhé! 🍳");
    } finally {
      stopFunnyLoading();
      fridgeState.isSuggesting = false;
      btnSuggest.disabled = false;
    }
  });

  // 6. Hiển thị danh sách món ăn gợi ý
  function renderRecipes(recipes) {
    recipesGrid.innerHTML = "";

    if (!recipes || recipes.length === 0) {
      recipesGrid.innerHTML = `
        <div class="empty-chips-hint" style="grid-column: 1 / -1; padding: 2rem;">
          Không tìm thấy món nào vừa miệng với số nguyên liệu này. Bạn thử nhập thêm gia vị hoặc tắt chế độ chay xem sao nhé! 🥺
        </div>
      `;
      recipesContainer.style.display = "flex";
      return;
    }

    recipesCountBadge.textContent = `${recipes.length} món`;

    recipes.forEach(recipe => {
      const card = document.createElement("article");
      card.className = "recipe-card";

      // Phân loại độ khó
      let diffClass = "badge-diff-easy";
      if (recipe.difficulty === "Vừa") diffClass = "badge-diff-medium";
      if (recipe.difficulty === "Khó") diffClass = "badge-diff-hard";

      // Nguyên liệu còn thiếu
      const hasMissing = recipe.missingIngredients && recipe.missingIngredients.length > 0;
      const missingHtml = hasMissing
        ? `<div class="missing-ingredients-box">⚠️ Cần mua thêm: ${recipe.missingIngredients.join(", ")}</div>`
        : `<div class="missing-ingredients-box all-good">✅ Đủ nguyên liệu trong tủ lạnh!</div>`;

      // Các bước nấu
      const stepsHtml = recipe.steps && recipe.steps.length > 0
        ? `<div class="cooking-steps-section">
             <div class="cooking-steps-title">🍳 Cách làm nhanh:</div>
             <ol class="cooking-steps-list">
               ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
             </ol>
           </div>`
        : "";

      const mapsQuery = encodeURIComponent(`${recipe.name} gần tôi`);

      card.innerHTML = `
        <div class="recipe-card-header">
          <div class="recipe-avatar-box" aria-hidden="true">${recipe.emoji || "🍲"}</div>
          <div class="recipe-badge-group">
            <span class="badge-meta ${recipe.vegetarian ? 'badge-veg-yes' : 'badge-veg-no'}">
              ${recipe.vegetarian ? '🌱 Chay' : '🍖 Mặn'}
            </span>
          </div>
        </div>

        <h3 class="recipe-title">${recipe.name}</h3>

        <div class="recipe-meta-row">
          <span class="badge-meta badge-time">⏱️ ${recipe.time || '15 phút'}</span>
          <span class="badge-meta ${diffClass}">Độ khó: ${recipe.difficulty || 'Dễ'}</span>
          <span class="badge-meta">👥 ${fridgeState.servings} người</span>
        </div>

        ${missingHtml}
        ${stepsHtml}

        <p class="recipe-funny-comment">"${recipe.comment || 'Nấu nhanh, ăn gọn, ngon khó cưỡng!'}"</p>

        <div class="recipe-card-footer">
          <a href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" 
             target="_blank" rel="noopener noreferrer" 
             class="btn-recipe-map" 
             aria-label="Tìm quán bán ${recipe.name} trên Google Maps nếu lười nấu">
            📍 Lười nấu? Tìm quán
          </a>
        </div>
      `;

      recipesGrid.appendChild(card);
    });

    recipesContainer.style.display = "flex";
    recipesContainer.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 7. Quản lý trạng thái chờ vui nhộn (Rotating Loading)
  function startFunnyLoading(messages) {
    loadingBox.style.display = "flex";
    let msgIndex = 0;
    loadingFunnyText.textContent = messages[0];

    fridgeState.loadingInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      loadingFunnyText.style.opacity = "0";
      setTimeout(() => {
        loadingFunnyText.textContent = messages[msgIndex];
        loadingFunnyText.style.opacity = "1";
      }, 200);
    }, 1800);
  }

  function stopFunnyLoading() {
    if (fridgeState.loadingInterval) {
      clearInterval(fridgeState.loadingInterval);
      fridgeState.loadingInterval = null;
    }
    loadingBox.style.display = "none";
  }

  // 8. Quản lý lỗi
  function showError(msg) {
    errorMessage.textContent = msg;
    errorBox.style.display = "flex";
  }

  function hideError() {
    errorBox.style.display = "none";
  }

  btnRetry.addEventListener("click", () => {
    hideError();
    if (fridgeState.resizedBase64 && !fridgeState.ingredients.length) {
      btnScan.click();
    } else if (fridgeState.ingredients.length) {
      btnSuggest.click();
    }
  });
}
