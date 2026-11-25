/**
 * MealMate - Ứng dụng gợi ý món ăn ngẫu nhiên theo ngân sách
 * File: js/app.js - Điều phối logic giao diện, hiệu ứng máy gắp và tương tác
 */

import { DISHES, getFilteredDishes } from '../data/dishes.js';
import { rollGacha, getRarityByPrice } from './gacha.js';
import { getHistory, addHistoryItem, clearHistory } from './storage.js';
import { initFridge } from './fridge.js';

// ============================================================================
// 1. TRẠNG THÁI ỨNG DỤNG (APP STATE)
// ============================================================================
const state = {
  selectedCategory: 'all',     // 'all' | 'breakfast' | 'lunch' | 'dinner' | 'drink' | 'snack' | 'party'
  maxBudget: 999999,          // Ngân sách tối đa (VND)
  onlyVegetarian: false,      // Chỉ món chay
  isClawing: false,           // Đang trong tiến trình gắp (khóa nút)
  activeTab: 'machine',       // 'machine' | 'catalog'
  currentPrize: null          // Món vừa gắp trúng
};

// ============================================================================
// 2. KHỞI TẠO DOM ELEMENTS
// ============================================================================
const dom = {
  // Tabs điều hướng
  navMachine: document.getElementById('nav-machine'),
  navCatalog: document.getElementById('nav-catalog'),
  navFridge: document.getElementById('nav-fridge'),
  machineView: document.getElementById('machine-view'),
  catalogView: document.getElementById('catalog-view'),
  fridgeView: document.getElementById('fridge-view'),
  totalDishesBadge: document.getElementById('total-dishes-badge'),

  // Bộ lọc bên máy gắp
  chips: document.querySelectorAll('.chip'),
  presetBtns: document.querySelectorAll('.preset-btn'),
  budgetSlider: document.getElementById('budget-slider'),
  budgetDisplay: document.getElementById('budget-display'),
  vegSwitch: document.getElementById('veg-switch'),
  matchingCount: document.getElementById('matching-count'),

  // Các bộ phận máy gắp
  clawMachine: document.getElementById('claw-machine'),
  clawAssembly: document.getElementById('claw-assembly'),
  clawCable: document.getElementById('claw-cable'),
  clawHeldItem: document.getElementById('claw-held-item'),
  plushiePit: document.getElementById('plushie-pit'),
  machineJoystick: document.getElementById('machine-joystick'),
  btnClaw: document.getElementById('btn-claw'),
  prizeChuteDoor: document.getElementById('prize-chute-door'),

  // Lịch sử
  historyContainer: document.getElementById('history-container'),
  btnClearHistory: document.getElementById('btn-clear-history'),

  // Kho món
  dishGrid: document.getElementById('dish-grid'),
  catFilterBtns: document.querySelectorAll('.cat-filter-btn'),
  catalogSearchInput: document.getElementById('catalog-search-input'),
  catalogCountBadge: document.getElementById('catalog-count-badge'),

  // Modal kết quả
  resultModal: document.getElementById('result-modal'),
  modalBackdrop: document.getElementById('modal-backdrop'),
  btnModalClose: document.getElementById('btn-modal-close'),
  capsuleTop: document.getElementById('capsule-top'),
  capsuleBottom: document.getElementById('capsule-bottom'),
  modalRarityBadge: document.getElementById('modal-rarity-badge'),
  modalRarityIcon: document.getElementById('modal-rarity-icon'),
  modalRarityName: document.getElementById('modal-rarity-name'),
  modalRarityStars: document.getElementById('modal-rarity-stars'),
  modalDishEmoji: document.getElementById('modal-dish-emoji'),
  modalDishName: document.getElementById('modal-dish-name'),
  modalDishPrice: document.getElementById('modal-dish-price'),
  modalDishCategory: document.getElementById('modal-dish-category'),
  modalDishVeg: document.getElementById('modal-dish-veg'),
  modalDishComment: document.getElementById('modal-dish-comment'),
  btnFindMaps: document.getElementById('btn-find-maps'),
  btnRegrap: document.getElementById('btn-regrap')
};

// ============================================================================
// 3. HÀM TIỆN ÍCH
// ============================================================================

/**
 * Định dạng số tiền VND (Ví dụ: 50.000 đ)
 */
function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

/**
 * Lấy tên tiếng Việt của danh mục món ăn
 */
function getCategoryLabel(category) {
  switch (category) {
    case 'breakfast': return 'Ăn sáng';
    case 'lunch': return 'Ăn trưa';
    case 'dinner': return 'Ăn tối';
    case 'drink': return 'Đồ uống';
    case 'snack': return 'Ăn vặt';
    case 'party': return 'Món nhậu';
    default: return 'Khác';
  }
}

/**
 * Kiểm tra xem người dùng có bật chế độ giảm chuyển động không
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Tạo một khoảng thời gian chờ (delay)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// 4. KHỞI TẠO VÀ LẮNG NGHE SỰ KIỆN
// ============================================================================
function init() {
  // Cập nhật tổng số món
  dom.totalDishesBadge.textContent = DISHES.length;

  // Điền các bóng thú bông ngẫu nhiên vào đáy buồng kính
  populatePlushiePit();

  // Cập nhật số lượng món khớp bộ lọc ban đầu
  updateFilterState();

  // Hiển thị lịch sử từ localStorage
  renderHistory();

  // Khởi tạo danh sách kho món
  renderCatalog();
  updateCatalogButtonCounts();

  // Khởi tạo tính năng Tủ Lạnh Thần Kỳ AI
  initFridge();

  // Đăng ký các sự kiện tương tác
  bindEvents();
}

/**
 * Điền các quả bóng thú bông trang trí vào đáy buồng máy gắp
 */
function populatePlushiePit() {
  dom.plushiePit.innerHTML = '';
  // Chọn 18 món đại diện sinh động
  const sampleDishes = DISHES.slice(0, 20);
  const pastelColors = ['#FFB6C8', '#B8EBD6', '#FFE6A7', '#D4C6F5', '#FFD199', '#ffffff'];

  sampleDishes.forEach((dish, idx) => {
    const ball = document.createElement('div');
    ball.className = 'plushie-ball';
    ball.textContent = dish.emoji;
    ball.title = dish.name;
    const color = pastelColors[idx % pastelColors.length];
    ball.style.backgroundColor = color;
    ball.style.animationDelay = `${(idx * 0.15) % 2}s`;
    dom.plushiePit.appendChild(ball);
  });
}

/**
 * Lắng nghe toàn bộ sự kiện từ người dùng
 */
function bindEvents() {
  // Chuyển tab giữa Máy Gắp, Kho Món và Tủ Lạnh Thần Kỳ
  dom.navMachine.addEventListener('click', () => switchTab('machine'));
  dom.navCatalog.addEventListener('click', () => switchTab('catalog'));
  dom.navFridge.addEventListener('click', () => switchTab('fridge'));

  // Chọn loại món ăn (Chips)
  dom.chips.forEach(chip => {
    chip.addEventListener('click', () => {
      dom.chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-checked', 'true');
      state.selectedCategory = chip.dataset.category;
      updateFilterState();
    });
  });

  // Chọn nhanh mức ngân sách (Preset buttons)
  dom.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const budget = parseInt(btn.dataset.budget, 10);
      state.maxBudget = budget;
      dom.budgetSlider.value = Math.min(budget, 250000);
      updateBudgetDisplay();
      updateFilterState();
    });
  });

  // Kéo thanh trượt ngân sách
  dom.budgetSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    // Nếu kéo lên kịch kim 250k thì coi như không giới hạn
    state.maxBudget = val >= 250000 ? 999999 : val;

    // Bỏ active ở preset buttons nếu giá trị tự do
    dom.presetBtns.forEach(b => {
      const bVal = parseInt(b.dataset.budget, 10);
      b.classList.toggle('active', bVal === state.maxBudget);
    });

    updateBudgetDisplay();
    updateFilterState();
  });

  // Công tắc món chay
  dom.vegSwitch.addEventListener('change', (e) => {
    state.onlyVegetarian = e.target.checked;
    dom.vegSwitch.setAttribute('aria-checked', state.onlyVegetarian ? 'true' : 'false');
    updateFilterState();
  });

  // Nút GẮP! to bự
  dom.btnClaw.addEventListener('click', handleStartClaw);

  // Phím tắt bàn phím: Phím Space để Gắp, Phím Escape để đóng modal
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !state.isClawing && dom.resultModal.style.display !== 'flex') {
      // Tránh cuộn trang khi nhấn Space
      if (document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        handleStartClaw();
      }
    }
    if (e.key === 'Escape' && dom.resultModal.style.display === 'flex') {
      closeModal();
    }
  });

  // Đóng modal
  dom.btnModalClose.addEventListener('click', closeModal);
  dom.modalBackdrop.addEventListener('click', closeModal);

  // Nút gắp lại trên modal
  dom.btnRegrap.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      handleStartClaw();
    }, 300);
  });

  // Xóa lịch sử
  dom.btnClearHistory.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa sạch lịch sử các lần gắp vừa rồi không? 🧹')) {
      clearHistory();
      renderHistory();
    }
  });

  // Bộ lọc bên Kho Món
  dom.catFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.catFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalog();
    });
  });

  // Tìm kiếm trong Kho Món
  dom.catalogSearchInput.addEventListener('input', () => {
    renderCatalog();
  });
}

/**
 * Chuyển tab giữa Máy gắp, Kho món và Tủ lạnh thần kỳ
 */
function switchTab(tabName) {
  state.activeTab = tabName;
  // Reset trạng thái các nút tab
  dom.navMachine.classList.remove('active');
  dom.navMachine.setAttribute('aria-selected', 'false');
  dom.navCatalog.classList.remove('active');
  dom.navCatalog.setAttribute('aria-selected', 'false');
  dom.navFridge.classList.remove('active');
  dom.navFridge.setAttribute('aria-selected', 'false');

  // Ẩn tất cả các view
  dom.machineView.style.display = 'none';
  dom.catalogView.style.display = 'none';
  dom.fridgeView.style.display = 'none';

  if (tabName === 'machine') {
    dom.navMachine.classList.add('active');
    dom.navMachine.setAttribute('aria-selected', 'true');
    dom.machineView.style.display = 'grid';
  } else if (tabName === 'catalog') {
    dom.navCatalog.classList.add('active');
    dom.navCatalog.setAttribute('aria-selected', 'true');
    dom.catalogView.style.display = 'block';
    renderCatalog();
  } else if (tabName === 'fridge') {
    dom.navFridge.classList.add('active');
    dom.navFridge.setAttribute('aria-selected', 'true');
    dom.fridgeView.style.display = 'flex';
  }
}

/**
 * Cập nhật hiển thị nhãn ngân sách
 */
function updateBudgetDisplay() {
  if (state.maxBudget >= 999999) {
    dom.budgetDisplay.textContent = '200k+ (Không giới hạn)';
  } else {
    dom.budgetDisplay.textContent = `≤ ${formatVND(state.maxBudget)}`;
  }
}

/**
 * Cập nhật trạng thái bộ lọc và đếm số món có sẵn
 */
function updateFilterState() {
  const availableDishes = getFilteredDishes({
    category: state.selectedCategory,
    maxBudget: state.maxBudget,
    onlyVegetarian: state.onlyVegetarian
  });

  const poolStatusEl = document.querySelector('.pool-status');

  if (availableDishes.length === 0) {
    dom.btnClaw.disabled = true;
    const catName = getCategoryLabel(state.selectedCategory);
    if (poolStatusEl) {
      poolStatusEl.innerHTML = `
        <span class="pool-icon" aria-hidden="true">💸</span>
        Ối giời! Ví hơi thắt lưng buộc bụng rồi! Không có món ${catName !== 'Khác' ? catName : ''} nào dưới ${formatVND(state.maxBudget)} ${state.onlyVegetarian ? 'chay ' : ''}đâu bạn ơi! Hãy tăng ngân sách tí nha! 🥺
      `;
      poolStatusEl.style.backgroundColor = '#ffdcd7';
      poolStatusEl.style.color = '#8b2b1d';
    }
  } else {
    dom.btnClaw.disabled = false;
    if (poolStatusEl) {
      poolStatusEl.innerHTML = `
        <span class="pool-icon" aria-hidden="true">🎲</span>
        Đang có <strong id="matching-count">${availableDishes.length}</strong> món trong máy gắp sẵn sàng phục vụ bạn!
      `;
      dom.matchingCount = document.getElementById('matching-count');
      poolStatusEl.style.backgroundColor = 'var(--lavender-purple)';
      poolStatusEl.style.color = 'var(--lavender-dark)';
    }
  }
}

// ============================================================================
// 5. HIỆU ỨNG VÀ LOGIC MÁY GẮP (CLAW ANIMATION)
// ============================================================================

/**
 * Bắt đầu tiến trình gắp món:
 * - Cần di chuyển sang phải/trái
 * - Cố tình gắp trượt 1-2 lần kèm rung lắc
 * - Gắp trúng và kéo món lên
 * - Thả món vào lỗ xả quà
 * - Bật bung viên nang phần thưởng
 */
async function handleStartClaw() {
  if (state.isClawing) return;

  const dishPool = getFilteredDishes({
    category: state.selectedCategory,
    maxBudget: state.maxBudget,
    onlyVegetarian: state.onlyVegetarian
  });

  if (dishPool.length === 0) {
    alert('Không tìm thấy món nào phù hợp với bộ lọc hiện tại! Bạn hãy nới lỏng ngân sách hoặc chọn lại nhóm nhé! 🥺');
    return;
  }

  // Chọn ra món trúng thưởng theo trọng số độ hiếm
  const chosenDish = rollGacha(dishPool);
  state.currentPrize = chosenDish;

  // Khóa nút gắp & kích hoạt hiệu ứng joystick
  state.isClawing = true;
  dom.btnClaw.disabled = true;
  dom.btnClaw.classList.add('pressed');
  dom.machineJoystick.classList.add('wiggle');

  // Nếu người dùng chọn prefers-reduced-motion, bỏ qua hoạt ảnh dài
  if (prefersReducedMotion()) {
    await sleep(250);
    finishClawAction(chosenDish);
    return;
  }

  const claw = dom.clawAssembly;
  const cable = dom.clawCable;
  const heldItem = dom.clawHeldItem;
  const heldEmoji = heldItem.querySelector('.held-emoji');

  heldItem.style.display = 'none';
  claw.classList.remove('claw-closed');

  try {
    // --- BƯỚC 1: Càng di chuyển ngang sang vị trí ngẫu nhiên 1 ---
    claw.style.left = '75%';
    await sleep(600);

    // --- BƯỚC 2: Thử gắp lần 1 nhưng trượt (hài hước) ---
    cable.style.height = '180px';
    await sleep(650);

    // Kẹp vào nhưng trượt
    claw.classList.add('claw-closed');
    await sleep(250);
    claw.classList.remove('claw-closed');
    // Rung lắc thất vọng
    claw.style.transform = 'translateX(-50%) rotate(10deg)';
    await sleep(150);
    claw.style.transform = 'translateX(-50%) rotate(-10deg)';
    await sleep(150);
    claw.style.transform = 'translateX(-50%) rotate(0deg)';

    // Rút càng lên vị trí ban đầu
    cable.style.height = '45px';
    await sleep(600);

    // --- BƯỚC 3: Càng di chuyển sang vị trí mục tiêu thực sự ---
    claw.style.left = '42%';
    await sleep(600);

    // Hạ càng sâu xuống đáy
    cable.style.height = '230px';
    await sleep(700);

    // Kẹp chặt món ăn!
    claw.classList.add('claw-closed');
    heldEmoji.textContent = chosenDish.emoji;
    heldItem.style.display = 'flex';
    await sleep(350);

    // --- BƯỚC 4: Kéo món ăn lên trần máy ---
    cable.style.height = '45px';
    await sleep(750);

    // --- BƯỚC 5: Di chuyển càng về bên trái ngay phía trên lỗ xả quà (chute) ---
    claw.style.left = '65px';
    await sleep(750);

    // --- BƯỚC 6: Nhả càng, thả rơi món vào lỗ xả ---
    claw.classList.remove('claw-closed');
    heldItem.style.transition = 'transform 0.4s ease-in, opacity 0.3s ease-in';
    heldItem.style.transform = 'translateY(160px) scale(0.6)';
    heldItem.style.opacity = '0';
    await sleep(400);

    // Khay nhận đồ phía dưới phát sáng
    dom.prizeChuteDoor.classList.add('open-glow');
    await sleep(350);

    // --- BƯỚC 7: Mở Modal kết quả viên nang ---
    finishClawAction(chosenDish);

  } catch (err) {
    console.error('Lỗi hiệu ứng máy gắp:', err);
    finishClawAction(chosenDish);
  } finally {
    // Reset lại vị trí càng sau khi hoàn thành
    setTimeout(() => {
      claw.style.left = '50%';
      claw.style.transform = 'translateX(-50%)';
      cable.style.height = '45px';
      heldItem.style.display = 'none';
      heldItem.style.transform = '';
      heldItem.style.opacity = '1';
      dom.prizeChuteDoor.classList.remove('open-glow');
    }, 800);
  }
}

/**
 * Hoàn tất gắp món: hiện Modal kết quả, lưu lịch sử, mở khóa nút
 */
function finishClawAction(dish) {
  state.isClawing = false;
  dom.btnClaw.disabled = false;
  dom.btnClaw.classList.remove('pressed');
  dom.machineJoystick.classList.remove('wiggle');

  // Lưu vào lịch sử LocalStorage
  addHistoryItem(dish);
  renderHistory();

  // Hiển thị Modal viên nang bung mở
  showResultModal(dish);
}

// ============================================================================
// 6. MODAL KẾT QUẢ VIÊN NANG (CAPSULE OPENING)
// ============================================================================

/**
 * Hiển thị kết quả món ăn trong viên nang bung mở
 */
function showResultModal(dish) {
  const rarity = dish.rarity || getRarityByPrice(dish.price);

  // Áp dụng màu độ hiếm cho viên nang
  dom.capsuleTop.style.background = `linear-gradient(180deg, ${rarity.capsuleColor} 0%, ${rarity.bgColor} 100%)`;
  dom.modalRarityBadge.style.backgroundColor = rarity.bgColor;
  dom.modalRarityBadge.style.color = rarity.textColor;
  dom.modalRarityIcon.textContent = rarity.icon;
  dom.modalRarityName.textContent = rarity.name;
  dom.modalRarityStars.textContent = rarity.stars;

  // Chi tiết món ăn
  dom.modalDishEmoji.textContent = dish.emoji;
  dom.modalDishName.textContent = dish.name;
  dom.modalDishPrice.textContent = formatVND(dish.price);
  dom.modalDishCategory.textContent = getCategoryLabel(dish.category);

  // Hiển thị huy hiệu chay nếu có
  if (dish.vegetarian) {
    dom.modalDishVeg.style.display = 'inline-block';
  } else {
    dom.modalDishVeg.style.display = 'none';
  }

  // Câu bình luận hài hước
  dom.modalDishComment.textContent = `"${dish.comment}"`;

  // Đường link Google Maps tìm quán gần tôi (không dùng API key)
  const mapsQuery = encodeURIComponent(`${dish.name} gần tôi`);
  dom.btnFindMaps.href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  // Bật modal
  dom.resultModal.style.display = 'flex';
  dom.btnFindMaps.focus();
}

/**
 * Đóng Modal
 */
function closeModal() {
  dom.resultModal.style.display = 'none';
}

// ============================================================================
// 7. LỊCH SỬ 10 LẦN GẮP GẦN NHẤT
// ============================================================================

function renderHistory() {
  const history = getHistory();
  dom.historyContainer.innerHTML = '';

  if (history.length === 0) {
    dom.historyContainer.innerHTML = `
      <div class="history-empty">Chưa có món nào được gắp. Hãy thử bấm "GẮP!" ngay nhé! 🍜</div>
    `;
    return;
  }

  history.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-item-card';

    const rarityBg = item.rarity ? item.rarity.bgColor : '#FFE6A7';
    const rarityText = item.rarity ? item.rarity.textColor : '#5B4636';
    const rarityName = item.rarity ? item.rarity.name : 'Bình dân';

    card.innerHTML = `
      <div class="history-item-emoji">${item.emoji}</div>
      <div class="history-item-details">
        <h4 class="history-item-name" title="${item.name}">${item.name}</h4>
        <div class="history-item-meta">
          <span class="history-item-price">${formatVND(item.price)}</span>
          <span class="badge-rarity" style="background-color: ${rarityBg}; color: ${rarityText};">${rarityName}</span>
          <span class="history-item-time">${item.formattedTime}</span>
        </div>
      </div>
    `;

    dom.historyContainer.appendChild(card);
  });
}

// ============================================================================
// 8. KHO MÓN ĂN (CATALOG VIEW)
// ============================================================================

function renderCatalog() {
  const activeBtn = document.querySelector('.cat-filter-btn.active');
  const cat = activeBtn ? activeBtn.dataset.cat : 'all';
  const keyword = dom.catalogSearchInput.value.trim().toLowerCase();

  const filtered = DISHES.filter(dish => {
    // Lọc danh mục
    let matchCat = true;
    if (cat === 'veg') {
      matchCat = dish.vegetarian === true;
    } else if (cat !== 'all') {
      matchCat = dish.category === cat;
    }

    // Lọc từ khóa tìm kiếm
    let matchSearch = true;
    if (keyword) {
      matchSearch = dish.name.toLowerCase().includes(keyword) ||
                    dish.comment.toLowerCase().includes(keyword);
    }

    return matchCat && matchSearch;
  });

  dom.catalogCountBadge.textContent = filtered.length;
  dom.dishGrid.innerHTML = '';

  if (filtered.length === 0) {
    dom.dishGrid.innerHTML = `
      <div class="history-empty" style="grid-column: 1 / -1;">
        Không tìm thấy món ăn nào khớp với từ khóa "${keyword}". Thử tìm món khác nha! 🥑
      </div>
    `;
    return;
  }

  filtered.forEach(dish => {
    const rarity = getRarityByPrice(dish.price);
    const card = document.createElement('article');
    card.className = 'dish-card';

    const mapsQuery = encodeURIComponent(`${dish.name} gần tôi`);

    card.innerHTML = `
      <div class="dish-card-header">
        <div class="dish-card-emoji-box" aria-hidden="true">${dish.emoji}</div>
        <div class="dish-card-badges">
          <span class="badge-rarity" style="background-color: ${rarity.bgColor}; color: ${rarity.textColor};">
            ${rarity.icon} ${rarity.name}
          </span>
          ${dish.vegetarian ? '<span class="badge-veg">🌱 Chay</span>' : ''}
        </div>
      </div>

      <h3 class="dish-card-title">${dish.name}</h3>
      <div class="dish-card-price">${formatVND(dish.price)}</div>
      <p class="dish-card-comment">"${dish.comment}"</p>

      <div class="dish-card-footer">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--cacao-light);">
          Nhóm: ${getCategoryLabel(dish.category)}
        </span>
        <a href="https://www.google.com/maps/search/?api=1&query=${mapsQuery}" 
           target="_blank" rel="noopener noreferrer" 
           class="btn-card-map" 
           aria-label="Tìm quán bán ${dish.name} gần tôi trên Google Maps">
          📍 Tìm quán
        </a>
      </div>
    `;

    dom.dishGrid.appendChild(card);
  });
}

/**
 * Cập nhật số lượng hiển thị trên các nút danh mục của Kho Món
 */
function updateCatalogButtonCounts() {
  const counts = {
    all: DISHES.length,
    breakfast: DISHES.filter(d => d.category === 'breakfast').length,
    lunch: DISHES.filter(d => d.category === 'lunch').length,
    dinner: DISHES.filter(d => d.category === 'dinner').length,
    drink: DISHES.filter(d => d.category === 'drink').length,
    snack: DISHES.filter(d => d.category === 'snack').length,
    party: DISHES.filter(d => d.category === 'party').length,
    veg: DISHES.filter(d => d.vegetarian).length,
  };

  dom.catFilterBtns.forEach(btn => {
    const cat = btn.dataset.cat;
    if (cat === 'all') btn.textContent = `Tất cả (${counts.all})`;
    else if (cat === 'breakfast') btn.textContent = `Ăn sáng (${counts.breakfast})`;
    else if (cat === 'lunch') btn.textContent = `Ăn trưa (${counts.lunch})`;
    else if (cat === 'dinner') btn.textContent = `Ăn tối (${counts.dinner})`;
    else if (cat === 'drink') btn.textContent = `Đồ uống (${counts.drink})`;
    else if (cat === 'snack') btn.textContent = `Ăn vặt (${counts.snack})`;
    else if (cat === 'party') btn.textContent = `Món nhậu (${counts.party})`;
    else if (cat === 'veg') btn.textContent = `Chỉ món chay (${counts.veg})`;
  });
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', init);
