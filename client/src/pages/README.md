# client/src/pages

## Mục đích
Thư mục chứa các trang (route-level) của ứng dụng client. Mỗi file đại diện cho một màn hình chính và thường được render qua React Router trong `App.jsx` và `Layout.jsx`.

## Tổng quan hoạt động
- Các trang lấy dữ liệu qua API (`client/src/api/axios.js`) và dùng Clerk (`useAuth`, `useUser`) để xác thực.
- Một số trang dùng Redux slice trong `client/src/features/*` để lấy/đẩy state dùng chung.
- `Layout.jsx` là khung chứa chung (sidebar, header, outlet).

## Các trang chính và chức năng

### 1) `Feed.jsx`
- Vai trò: Trang chủ hiển thị danh sách bài viết (feeds), stories, quảng cáo và bộ lọc tags.
- Logic chính:
  - Gọi `GET /api/post/feed` (kèm Bearer token từ Clerk) để lấy danh sách bài viết.
  - Lọc bài viết theo tags (logic lọc theo từ khóa và hashtag trong nội dung).
  - Tối ưu UX: xử lý `redirectPostId` từ localStorage để đẩy bài viết vừa xem/được share lên đầu feed sau đăng nhập.
  - Render bài viết bằng `PostCardOptimized.jsx`, thanh stories, `TagsFilter.jsx`, `AdCarousel.jsx`.
- Tương tác:
  - Với `components`: `StoriesCarousel`, `TagsFilter`, `PostCardOptimized`, `AdCarousel`, `RecentMessages`.
  - Với `api/axios.js` để gọi API và Clerk token.

### 2) `Login.jsx`
- Vai trò: Trang đăng nhập (ưu tiên Clerk). Khi chưa có `user` trong `App.jsx`, route `/` sẽ render trang này.
- Logic chính: Hiển thị UI đăng nhập, chuyển hướng về `/` sau khi sign-in thành công.
- Tương tác: Clerk (`useUser`, `useAuth`).

### 3) `Layout.jsx`
- Vai trò: Khung layout chung cho các route con (sidebar bên trái, phần nội dung chính ở giữa).
- Logic chính: Lấy `user` từ Redux để đảm bảo đã có thông tin người dùng trước khi hiển thị nội dung; hiển thị `Sidebar`, `Outlet`.
- Tương tác: `Sidebar.jsx`, Redux `userSlice`.

### 4) `CreatePost.jsx`
- Vai trò: Trang tạo bài viết mới (nội dung, ảnh/video).
- Logic chính: Gửi form-data lên API tạo post (có xác thực); xử lý upload ảnh/video qua backend (multer/imagekit tùy cấu hình server).
- Tương tác: `api/axios.js`, Clerk token, `PostCard` (nếu xem preview).

### 5) `Profile.jsx`
- Vai trò: Trang hồ sơ người dùng (cá nhân hoặc người khác theo `:profileId`).
- Logic chính: Lấy thông tin user, bài viết, kết nối; hiển thị và cho thao tác follow/connect nếu có.
- Tương tác: API user/post, Redux `userSlice`, `connectionsSlice`.

### 6) `Messages.jsx` và `ChatBox.jsx`
- Vai trò: Hiển thị danh sách hội thoại (`Messages`) và khung chat theo `:userId` (`ChatBox`).
- Logic chính: Kết hợp SSE (Server-Sent Events) nhận tin nhắn realtime (được khởi tạo trong `App.jsx`), thêm tin nhắn vào Redux, hiển thị thông báo.
- Tương tác: API message, Redux `messagesSlice`, `Notification.jsx` (toast).

### 7) `Discover.jsx`
- Vai trò: Khám phá người dùng/bài viết theo đề xuất.
- Logic chính: Gọi API tìm kiếm/đề xuất, hiển thị danh sách user/post.
- Tương tác: API discovery, `UserCard.jsx`.

### 8) `Connections.jsx`
- Vai trò: Quản lý kết nối/bạn bè.
- Logic chính: Lấy danh sách connect/follow, hành động chấp nhận/hủy.
- Tương tác: API connections, Redux `connectionsSlice`.

### 9) `PublicPost.jsx`
- Vai trò: Trang hiển thị post công khai theo `post/:postId` (dùng để share link).
- Logic chính:
  - Gọi `GET /api/post/public/:postId` không cần token.
  - Nếu người dùng chưa đăng nhập và tương tác (like/comment), lưu `redirectPostId` vào localStorage để sau đăng nhập đưa post lên đầu feed.
- Tương tác: `PostCard.jsx` (ở chế độ requireAuth), `api/axios.js`.

## Mối liên hệ giữa các file
- `Feed.jsx` là trung tâm hiển thị nội dung và điều phối phần lớn components.
- `Layout.jsx` bọc các route con; `App.jsx` định nghĩa router và SSE để nhận tin nhắn realtime.
- Các trang lấy dữ liệu thông qua `api/axios.js` và xác thực qua Clerk.
