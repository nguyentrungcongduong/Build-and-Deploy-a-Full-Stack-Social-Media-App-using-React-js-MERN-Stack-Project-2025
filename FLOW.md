# FLOW - Luồng chạy các tính năng chính

Tài liệu mô tả chi tiết flow end-to-end (client → server → DB → realtime) cho các tính năng chính của hệ thống.

Môi trường chính:
- Client: React + Redux + Clerk + Axios
- Server: Node.js + Express + Mongoose, Multer, SSE, (ImageKit optional)
- Auth: Clerk (client SDK và token Bearer)

Ký hiệu:
- C: Client
- S: Server
- DB: Database (MongoDB)

---

## 1) Đăng nhập bằng Clerk

### Luồng chạy
1. C (App.jsx) khởi tạo Clerk. Nếu `user` chưa tồn tại, route `/` render `Login.jsx`.
2. User đăng nhập qua UI của Clerk (client side).
3. C (App.jsx) khi có `user`: gọi `getToken()` → dispatch `fetchUser(token)` và `fetchConnections(token)`.
4. S nhận request lấy thông tin user, ánh xạ Clerk userId → `models/User`.
5. Trả dữ liệu user về C, lưu vào Redux `userSlice`. Layout hiển thị.

### Vai trò
- Clerk: xác thực, cấp token, quản lý phiên đăng nhập.
- API: cung cấp endpoint lấy dữ liệu user/connection theo token.
- DB: lưu thông tin user, connection.

### File liên quan
- Client: `client/src/App.jsx`, `client/src/pages/Login.jsx`, `client/src/features/user/userSlice.js`, `client/src/features/connections/connectionsSlice.js`
- Server: `server/middlewares/auth.js`, `server/controllers/userController.js`, `server/routes/userRotes.js`, `server/models/User.js`

Sơ đồ ASCII (rút gọn):
```
User → Clerk(Login) → App.jsx(getToken)
App.jsx → /api/user/me (token) → userController → DB(User)
                          ← user JSON
Redux(user) ←
```

---

## 2) Hiển thị Feed (trang chủ)

### Luồng chạy
1. C (`Feed.jsx`) gọi `GET /api/post/feed` kèm Bearer token.
2. S (`postController`) đọc user từ token → truy vấn DB lấy posts phù hợp.
3. S trả danh sách posts. C hiển thị bằng `PostCardOptimized`.
4. Nếu có `redirectPostId` (user vừa xem public/share), C đưa post tương ứng lên đầu feed.

### Vai trò
- API: trả về feed theo người dùng.
- DB: cung cấp dữ liệu post + user liên quan.
- LocalStorage: tạm giữ `redirectPostId` cho trải nghiệm sau đăng nhập.

### File liên quan
- Client: `client/src/pages/Feed.jsx`, `client/src/components/PostCardOptimized.jsx`, `client/src/components/TagsFilter.jsx`, `client/src/components/AdCarousel.jsx`
- Server: `server/controllers/postController.js`, `server/routes/postRoutes.js`, `server/models/Post.js`

---

## 3) Tạo bài viết (Create Post)

### Luồng chạy
1. C (`CreatePost.jsx`) nhận content + media (ảnh/video) → gửi `multipart/form-data` `POST /api/post`.
2. S dùng `multer` (`configs/multer.js`) để nhận file, (tuỳ chọn) upload CDN (ImageKit) rồi lấy URL.
3. S lưu `Post` vào DB (content, image_urls/video_urls, userId...).
4. S trả post mới; C có thể điều hướng về `/` hoặc hiển thị ngay.

### Vai trò
- Multer/ImageKit: xử lý upload và tạo URL media.
- API/DB: lưu bản ghi `Post` kèm các URL media.

### File liên quan
- Client: `client/src/pages/CreatePost.jsx`, `client/src/components/PostCard.jsx`
- Server: `server/configs/multer.js`, `server/configs/imageKit.js`, `server/controllers/postController.js`, `server/models/Post.js`, `server/routes/postRoutes.js`

---

## 4) Like / Unlike post (Optimistic Update)

### Luồng chạy
1. C (`PostCardOptimized.jsx`) khi user click like: cập nhật UI ngay (optimistic) → `POST /api/post/like`.
2. S xác thực token, cập nhật `likes_count` (mảng userId) trong `Post`.
3. Nếu lỗi, C rollback state và báo lỗi.

### Vai trò
- Client: Optimistic UI để mượt mà.
- API/DB: ghi nhận like/unlike.

### File liên quan
- Client: `client/src/components/PostCardOptimized.jsx`
- Server: `server/controllers/postController.js`, `server/models/Post.js`, `server/routes/postRoutes.js`

---

## 5) Bình luận (Comment)

### Luồng chạy
1. C (`PostCardOptimized.jsx`) thêm comment: cập nhật UI (optimistic) → `POST /api/post/comment`.
2. S thêm comment vào post (mảng `comments`).
3. Nếu lỗi, C rollback comment tạm.

### Vai trò
- Giống like/unlike, chỉ khác thao tác cập nhật mảng `comments`.

### File liên quan
- Client: `client/src/components/PostCardOptimized.jsx`
- Server: `server/controllers/postController.js`, `server/models/Post.js`

---

## 6) Share Public Post → Redirect về Feed sau đăng nhập

### Luồng chạy
1. C (`PublicPost.jsx`) `GET /api/post/public/:postId` để hiển thị bài viết cho user chưa đăng nhập.
2. Nếu user muốn like/comment mà chưa đăng nhập: lưu `redirectPostId` vào `localStorage` và chuyển về `/` (Login → Clerk).
3. Sau khi đăng nhập thành công, `Feed.jsx` phát hiện `redirectPostId` và đẩy bài viết tương ứng lên đầu danh sách.

### Vai trò
- Public API: cho phép xem post không cần token.
- LocalStorage: lưu `redirectPostId` để tái tạo context sau đăng nhập.

### File liên quan
- Client: `client/src/pages/PublicPost.jsx`, `client/src/pages/Feed.jsx`, `client/src/components/PostCard.jsx`
- Server: `server/controllers/postController.js` (public endpoint), `server/routes/postRoutes.js`

Sơ đồ ASCII:
```
PublicPost → like/comment → requireAuth? → save redirectPostId → Login
Login success → Feed mounts → read redirectPostId → highlight post → clear
```

---

## 7) Kết nối/Bạn bè (Connections)

### Luồng chạy
1. C (App.jsx) sau login: `fetchConnections(token)` → lấy danh sách connections.
2. Trang `Connections.jsx` hiển thị danh sách; thao tác accept/decline follow/request gọi API tương ứng.
3. S cập nhật `Connection` trong DB.

### Vai trò
- Redux slice `connectionsSlice` lưu danh sách kết nối.
- API/DB xử lý trạng thái quan hệ.

### File liên quan
- Client: `client/src/features/connections/connectionsSlice.js`, `client/src/pages/Connections.jsx`
- Server: `server/models/Connection.js`, `server/controllers/userController.js` (tuỳ triển khai), `server/routes/userRotes.js`

---

## 8) Chat realtime (SSE)

### Luồng chạy
1. C (`App.jsx`) mở SSE tới `GET /api/message/:userId` sau khi xác thực.
2. S (messageController) push message tới client tương ứng bằng SSE mỗi khi có tin nhắn mới.
3. Nếu C đang mở `ChatBox` với `from_user_id` trùng tin nhắn tới: dispatch `addMessage` để thêm vào Redux.
4. Ngược lại, hiển thị `Notification.jsx` (toast) kèm nội dung tóm tắt.

### Vai trò
- SSE: luồng dữ liệu một chiều từ server về client trong thời gian thực.
- Redux: lưu tin nhắn theo hội thoại.

### File liên quan
- Client: `client/src/App.jsx`, `client/src/features/messages/messagesSlice.js`, `client/src/pages/ChatBox.jsx`, `client/src/components/Notification.jsx`
- Server: `server/controllers/messageController.js`, `server/models/Message.js`, `server/routes/messageRoutes.js`

Sơ đồ ASCII:
```
App.jsx → EventSource(/api/message/:userId)
Server → SSE onmessage → client
if path === /messages/:fromId → addMessage
else → toast notification
```

---

## 9) Stories

### Luồng chạy
1. C (`StoriesCarousel.jsx`, `StoriesBar.jsx`) gọi API lấy stories.
2. S (storyController) trả danh sách stories theo user và thời hạn.
3. C mở `StoryModal` hoặc `StoryViewer` để xem chi tiết.

### Vai trò
- API/DB: lưu và trả stories.

### File liên quan
- Client: `client/src/components/StoriesCarousel.jsx`, `client/src/components/StoriesBar.jsx`, `client/src/components/StoryModal.jsx`, `client/src/components/StoryViewer.jsx`
- Server: `server/controllers/storyController.js`, `server/models/Story.js`, `server/routes/storyRoutes.js`

---

## 10) Upload ảnh/video (multer → ImageKit)

### Luồng chạy
1. C gửi form-data (ảnh/video) kèm nội dung bài viết tới `POST /api/post` (hoặc PUT khi edit).
2. S dùng `multer` nhận file vào thư mục tạm `uploads/`.
3. (Tuỳ chọn) S upload file tạm lên CDN (ImageKit) → nhận URL CDN.
4. S lưu URL vào DB (Post.image_urls / video_urls) → trả về client.

### Vai trò
- Multer: nhận dữ liệu file từ client.
- ImageKit: CDN lưu trữ và phân phối media.
- DB: lưu metadata (URL) để client render.

### File liên quan
- Client: `client/src/components/PostCard.jsx` (edit/upload), `client/src/pages/CreatePost.jsx`
- Server: `server/configs/multer.js`, `server/configs/imageKit.js`, `server/controllers/postController.js`, `server/models/Post.js`

---

## 11) Quảng cáo (AdCarousel)

### Luồng chạy
1. C đọc `adData` (ảnh/link/màu nền) và `carouselConfig` từ `client/src/data/adData.js`.
2. `AdCarousel.jsx` tự động xoay (auto-play), hỗ trợ pause, dot navigation; xử lý loading và fallback khi ảnh lỗi.
3. Click quảng cáo → `window.open(link)` mở tab mới.

### Vai trò
- Client-side only (không cần server).

### File liên quan
- Client: `client/src/components/AdCarousel.jsx`, `client/src/data/adData.js`, `client/src/components/adCarousel.css`

---

## Ghi chú triển khai & vận hành
- Auth: luôn truyền Bearer token từ Clerk khi gọi endpoint yêu cầu bảo mật.
- Redirect post share: dùng `localStorage.redirectPostId` để trả user về đúng ngữ cảnh sau đăng nhập.
- SSE: đóng connection khi unmount để tránh rò rỉ tài nguyên.
- Upload: dọn file tạm nếu không đẩy CDN; cấu hình biến môi trường cho ImageKit/Mongo.

---

Tài liệu này là cái nhìn hệ thống. Khi cần chi tiết thêm, xem README riêng từng thư mục:
- `client/src/pages/README.md`
- `client/src/components/README.md`
- `client/src/features/README.md`
- `client/src/api/README.md`
- `server/controllers/README.md`
- `server/routes/README.md`
- `server/models/README.md`
- `server/middlewares/README.md`
- `server/configs/README.md`
