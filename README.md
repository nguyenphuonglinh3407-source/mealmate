# MealMate (Claw Machine Food Picker)

Ứng dụng web gợi ý món ăn ngẫu nhiên theo ngân sách, phong cách máy gắp thú bông arcade màu pastel hài hước, phục vụ bài tập môn học (phi thương mại).

## 1. Giới thiệu
"Trưa nay ăn gì?" luôn là câu hỏi nan giải mỗi ngày. Web app "MealMate" biến việc chọn món ăn thành một trò chơi gắp thú bông vui nhộn:
- Chọn nhóm: Ăn trưa, Đồ uống, Ăn vặt, Món nhậu.
- Chọn ngân sách linh hoạt: Các mốc nhanh 20k, 30k, 50k, 80k, 120k, 200k+ hoặc kéo thanh trượt.
- Tùy chọn lọc: Chỉ món chay.
- Hệ thống độ hiếm: Bình dân, Ngon bất ngờ, Hơi sang nha, Ví khóc thét, Lương về mới dám.
- Tìm quán gần tôi: Kết nối trực tiếp bản đồ Google Maps theo món vừa trúng thưởng.
- Lịch sử: Lưu trữ 10 lần gắp gần nhất trên trình duyệt.
- Kho món: Xem toàn bộ thực đơn kèm tìm kiếm từ khóa và lọc nhóm.

## 2. Giao diện & Trải nghiệm
- Bảng màu pastel nhẹ nhàng: Nền kem `#FFF6EC`, Hồng kẹo `#FFB6C8`, Xanh bạc hà `#B8EBD6`, Vàng bơ `#FFE6A7`, Tím lavender `#D4C6F5`, Chữ nâu cacao `#5B4636`.
- Hiệu ứng máy gắp: Càng gắp chuyển động ngang, kẹp thử trượt vui nhộn, gắp trúng món và thả quà vào cửa xả.
- Hỗ trợ tốt trên màn hình điện thoại (responsive) và tôn trọng thiết lập `prefers-reduced-motion`.

## 3. Cấu trúc thư mục
```
mealmate/
├── index.html        # Trang giao diện chính
├── css/
│   └── style.css     # Định dạng phong cách pastel và hiệu ứng máy gắp
├── js/
│   ├── app.js        # Điều phối giao diện và tương tác
│   ├── gacha.js      # Tính toán độ hiếm và thuật toán gắp ngẫu nhiên
│   └── storage.js    # Quản lý lưu trữ lịch sử qua localStorage
├── data/
│   └── dishes.js     # Dữ liệu món ăn độc lập
├── .gitignore
├── LICENSE           # Giấy phép nguồn mở MIT
└── README.md         # Tài liệu hướng dẫn
```

## 4. Hướng dẫn chạy ứng dụng
Do ứng dụng sử dụng HTML/CSS/JavaScript thuần (ES Modules):
1. Tải hoặc clone mã nguồn về máy.
2. Mở file `index.html` thông qua một máy chủ web nội bộ đơn giản (ví dụ: tiện ích Live Server trong VS Code, hoặc lệnh `python -m http.server 8000`).
3. Truy cập địa chỉ hiển thị trên trình duyệt (ví dụ: `http://localhost:8000`).

## 5. Cách thêm món ăn mới
Để bổ sung món ăn, mở file `data/dishes.js` và thêm đối tượng mới vào mảng `DISHES`:
```javascript
{
  id: 'l99',
  name: 'Tên món ăn',
  category: 'lunch', // 'lunch' | 'drink' | 'snack' | 'party'
  price: 45000,
  vegetarian: false, // true nếu là món chay
  emoji: '🍲',
  comment: 'Một câu nhận xét hài hước về món ăn.'
}
```

## 6. Nguồn ý tưởng
Ý tưởng vận hành tham khảo từ website truanayangi.com. Giao diện, mã nguồn và dữ liệu do tác giả tự thực hiện.

## 7. Giấy phép
Dự án được phân phối dưới giấy phép MIT License.
