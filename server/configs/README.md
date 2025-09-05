# server/configs

## Mục đích
Cấu hình các dịch vụ phụ trợ: cơ sở dữ liệu, upload file, gửi mail, CDN media, v.v.

## Các file thường gặp
- `db.js`: Kết nối MongoDB qua Mongoose (URI từ biến môi trường). Export hàm connect để server gọi khi khởi động.
- `multer.js`: Cấu hình `multer` để nhận `multipart/form-data` (ảnh/video) từ client; lưu tạm ở thư mục `uploads/`.
- `imageKit.js`: (nếu có) cấu hình SDK ImageKit để upload media lên CDN; controller gọi `imagekit.upload` với tham số từ `multer`.
- `nodeMailer.js`: (nếu có) cấu hình transporter gửi email.

## Luồng upload media (tham khảo)
Client (form-data) -> route có `multer` -> controller đọc file -> (tuỳ chọn) upload lên ImageKit -> lưu URL vào model -> trả kết quả cho client.
