# MealMate (Claw Machine Food Picker)

Ứng dụng web gợi ý món ăn ngẫu nhiên theo ngân sách, phong cách máy gắp thú bông arcade màu pastel hài hước, phục vụ bài tập môn học (phi thương mại).

## 1. Giới thiệu
"Hôm nay ăn gì?" luôn là câu hỏi nan giải mỗi ngày. Web app "MealMate" biến việc chọn món ăn thành một trò chơi gắp thú bông vui nhộn:
- Chọn nhóm món ăn theo thứ tự trong ngày: **Ăn sáng**, **Ăn trưa**, **Ăn tối**, **Đồ uống**, **Ăn vặt**, **Món nhậu**.
- Chọn ngân sách linh hoạt: Các mốc nhanh 20k, 30k, 50k, 80k, 120k, 200k+ hoặc kéo thanh trượt trực quan.
- Tùy chọn lọc: Chỉ món chay.
- Hệ thống độ hiếm: Bình dân, Ngon bất ngờ, Hơi sang nha, Ví khóc thét, Lương về mới dám.
- Tìm quán gần tôi: Kết nối trực tiếp bản đồ Google Maps theo món vừa trúng thưởng.
- Lịch sử: Lưu trữ 10 lần gắp gần nhất trên trình duyệt qua `localStorage`.
- Kho món: Xem toàn bộ 138 món ăn phong phú (22 món sáng, 32 món trưa, 26 món tối, 22 đồ uống, 18 ăn vặt, 18 món nhậu; trong đó có 66 món chay) kèm tìm kiếm từ khóa và lọc nhóm.
- Tủ Lạnh Thần Kỳ AI: Chụp/chọn ảnh tủ lạnh để AI tự động nhận diện nguyên liệu và gợi ý món nấu ngay tại nhà.

## 2. Giao diện & Trải nghiệm
- Bảng màu pastel nhẹ nhàng: Nền kem `#FFF6EC`, Hồng kẹo `#FFB6C8`, Xanh bạc hà `#B8EBD6`, Vàng bơ `#FFE6A7`, Tím lavender `#D4C6F5`, Chữ nâu cacao `#5B4636`.
- Hiệu ứng máy gắp: Càng gắp chuyển động ngang, kẹp thử trượt vui nhộn, gắp trúng món và thả quà vào cửa xả.
- Hỗ trợ tốt trên màn hình điện thoại (responsive) và tôn trọng thiết lập `prefers-reduced-motion`.

## 3. Cấu trúc thư mục
```
mealmate/
├── index.html        # Trang giao diện chính
├── css/
│   ├── style.css     # Phong cách pastel và hiệu ứng máy gắp
│   └── fridge.css    # Giao diện Tủ Lạnh Thần Kỳ AI
├── js/
│   ├── app.js        # Điều phối giao diện và tương tác
│   ├── gacha.js      # Tính toán độ hiếm và thuật toán gắp ngẫu nhiên
│   ├── storage.js    # Quản lý lưu trữ lịch sử qua localStorage
│   └── fridge.js     # Logic xử lý ảnh và gợi ý món AI
├── data/
│   └── dishes.js     # Kho dữ liệu 138 món ăn độc lập
├── worker/           # Cloudflare Worker proxy cho Gemini API
│   ├── index.js
│   ├── wrangler.toml
│   └── README.md
├── .gitignore
├── LICENSE           # Giấy phép nguồn mở MIT
└── README.md         # Tài liệu hướng dẫn
```

## 4. Hướng dẫn chạy ứng dụng
Do ứng dụng sử dụng HTML/CSS/JavaScript thuần (ES Modules):
1. Tải hoặc clone mã nguồn về máy.
2. Chạy máy chủ tĩnh cục bộ bằng lệnh:
   ```bash
   npx serve -l 3000
   ```
3. Truy cập địa chỉ hiển thị trên trình duyệt: `http://localhost:3000`.

## 5. Cách thêm món ăn mới
Để bổ sung món ăn, mở file `data/dishes.js` và thêm đối tượng mới vào mảng `DISHES`:
```javascript
{
  id: 'b99',
  name: 'Tên món ăn',
  category: 'breakfast', // 'breakfast' | 'lunch' | 'dinner' | 'drink' | 'snack' | 'party'
  price: 25000,
  vegetarian: false, // true nếu là món chay
  emoji: '🍲',
  comment: 'Một câu nhận xét hài hước về món ăn.'
}
```

## 6. Nguồn ý tưởng
Ý tưởng vận hành tham khảo từ website truanayangi.com. Giao diện, mã nguồn và dữ liệu do tác giả tự thực hiện.

## 7. Giấy phép
Dự án được phân phối dưới giấy phép MIT License.
