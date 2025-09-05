# server/controllers

## Mục đích
Chứa các hàm điều khiển (controller) xử lý nghiệp vụ cho API. Mỗi controller tương ứng một domain: post, user, message, story.

## Các file chính và chức năng

### 1) `postController.js`
- Vai trò: Xử lý toàn bộ CRUD và tương tác với bài viết.
- Logic chính:
  - Tạo/sửa/xóa post (xử lý upload ảnh/video qua multer và/hoặc ImageKit – tham chiếu config).
  - `getFeed`: trả về danh sách post cho trang chủ theo người dùng/quan hệ.
  - Like/Unlike, Comment/Uncomment: cập nhật trường `likes_count`, `comments` trong model.
  - `getPublicPost`: trả về post công khai theo `:postId` dùng cho trang share.
- Tương tác: `models/Post.js`, `configs/multer.js`, `configs/imageKit.js`, `middlewares/auth.js`.

### 2) `userController.js`
- Vai trò: Lấy thông tin, cập nhật hồ sơ, tìm kiếm/đề xuất user.
- Logic chính: map Clerk userId sang user trong DB; cập nhật profile, ảnh đại diện/bìa nếu có upload.
- Tương tác: `models/User.js`, `middlewares/auth.js`.

### 3) `messageController.js`
- Vai trò: Gửi/nhận tin nhắn, stream tin nhắn realtime (SSE endpoint).
- Logic chính: lưu tin nhắn vào `models/Message.js`, expose SSE (`/api/message/:userId`) để client subscribe.
- Tương tác: `models/Message.js`, phía client lắng nghe trong `App.jsx`.

### 4) `storyController.js`
- Vai trò: CRUD stories (ảnh/video, text), lấy stories theo user.
- Tương tác: `models/Story.js`, `configs/multer.js`.

## Quan hệ giữa các phần
- Controllers gọi `models/*` để tương tác DB.
- Xử lý file upload dựa vào `configs/multer.js` và có thể đẩy lên ImageKit (`configs/imageKit.js`).
- Các route trong `server/routes/*` map URL tới hàm controller tương ứng.
