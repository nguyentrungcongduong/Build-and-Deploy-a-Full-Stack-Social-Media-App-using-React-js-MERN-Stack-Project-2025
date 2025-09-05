# client/src/features

## Mục đích
Tổ chức state dùng chung theo mô hình Redux Toolkit slice. Mỗi slice quản lý một mảng nghiệp vụ: người dùng, kết nối, tin nhắn.

## Các slice chính

### 1) `user/userSlice.js`
- Mục đích: Lưu thông tin người dùng hiện tại (đồng bộ với Clerk) và các meta liên quan.
- Logic chính: `fetchUser(token)` gọi backend lấy thông tin user theo Clerk userId, lưu vào store.
- Tương tác: Được dispatch trong `App.jsx` sau khi có `user` từ Clerk.

### 2) `connections/connectionsSlice.js`
- Mục đích: Quản lý danh sách kết nối/bạn bè/follow.
- Logic chính: `fetchConnections(token)` lấy connections từ backend; cung cấp reducers để cập nhật sau khi accept/decline.
- Tương tác: Các trang như `Connections.jsx` đọc và hiển thị.

### 3) `messages/messagesSlice.js`
- Mục đích: Lưu state tin nhắn theo hội thoại.
- Logic chính: `addMessage(message)` để thêm tin nhắn mới (được bắn từ SSE trong `App.jsx`), selectors để lấy tin theo user.
- Tương tác: `ChatBox.jsx`, `Messages.jsx` sử dụng để render UI chat realtime.

## Luồng dữ liệu
- Clerk xác thực -> Lấy token -> dispatch `fetchUser`, `fetchConnections` -> Components đọc state qua `useSelector`.
- SSE nhận tin nhắn -> dispatch `addMessage` -> UI cập nhật tức thì.
