# server/models

## Mục đích
Định nghĩa schema Mongoose cho các thực thể chính của hệ thống: `User`, `Post`, `Message`, `Story`, `Connection`.

## Các model chính
- `User.js`: thông tin người dùng (full_name, username, avatar/cover, bio, followers/following/connections...).
- `Post.js`: nội dung bài viết, danh sách ảnh/video (`image_urls`, `video_urls`), `likes_count` (mảng userId), `comments`.
- `Message.js`: tin nhắn giữa 2 user, nội dung, thời gian gửi.
- `Story.js`: nội dung story (ảnh/video/text), thời hạn hiển thị.
- `Connection.js`: quan hệ kết nối giữa user (follow/request/accept...).

## Quan hệ
- `Post.user` tham chiếu `User`.
- `Message.from_user_id`/`to_user_id` tham chiếu `User`.
- `Story.user` tham chiếu `User`.

## Lưu ý
- Các trường media url được backend sinh ra sau khi upload (multer -> lưu local hoặc đẩy lên ImageKit).
