# server/routes

## Mục đích
Định nghĩa các endpoint của REST API và ánh xạ (map) tới các controller.

## Các file chính
- `postRoutes.js`: map CRUD post, like/comment, feed, public post -> `postController`.
- `userRotes.js` (typo tên file): map user profile, tìm kiếm, cập nhật -> `userController`.
- `messageRoutes.js`: map gửi tin nhắn, SSE stream -> `messageController`.
- `storyRoutes.js`: map CRUD stories -> `storyController`.

## Cách hoạt động
- Mỗi file export một router của Express.
- Dùng `middlewares/auth.js` để bảo vệ các route cần xác thực (đọc Bearer token từ header).
