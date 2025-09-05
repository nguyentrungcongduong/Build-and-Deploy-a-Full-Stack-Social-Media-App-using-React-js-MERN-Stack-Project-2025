# client/src/components

## Mục đích
Thư mục chứa các thành phần (components) có thể tái sử dụng trên nhiều trang: thẻ bài viết, sidebar, modal story, carousel, v.v.

## Tổng quan hoạt động
- Components tập trung hiển thị UI và phát sinh event (onClick, onLiked, onPostUpdated...).
- Dữ liệu thường được truyền từ trang (pages) xuống dưới dạng props. Một số component tự gọi API (ví dụ hành động like/comment) nếu cần.
- Nhiều component sử dụng Clerk token và axios để gọi API; sử dụng `react-hot-toast` cho phản hồi nhanh.

## Thành phần chính và chức năng

### 1) `PostCard.jsx` (bản cơ sở)
- Vai trò: Thẻ hiển thị một bài viết: nội dung, ảnh/video, số like, bình luận.
- Logic chính: xử lý like/comment, hiển thị menu (chỉnh sửa/xóa nếu là chủ bài viết), mở modal chỉnh sửa/xóa.
- Tương tác: gọi API `/api/post/*`, cần Bearer token; nhận callback `onLiked`, `onPostUpdated`, `onPostDeleted`.

### 2) `PostCardOptimized.jsx`
- Vai trò: Phiên bản tối ưu UX với optimistic update cho like/comment.
- Logic chính:
  - Optimistic update: cập nhật ngay UI trước khi API phản hồi; rollback nếu lỗi.
  - `useCallback`, `useMemo` để giảm re-render; cung cấp event handlers ổn định.
- Tương tác: props từ `Feed.jsx`; gọi API `/api/post/like`, `/api/post/comment`.

### 3) `Sidebar.jsx` + `MenuItems.jsx`
- Vai trò: Điều hướng chính của app; hiển thị logo, menu, liên hệ, QR.
- Logic chính: dùng `NavLink` để highlight item đang active; logo click về `/`.
- Tương tác: `assets.js` để lấy logo; `MenuItems.jsx` đọc `menuItemsData`.

### 4) `StoriesBar.jsx`, `StoriesCarousel.jsx`, `StoryModal.jsx`, `StoryViewer.jsx`
- Vai trò: Hiển thị stories dạng danh sách/slider, modal xem chi tiết.
- Logic chính: render ảnh/video story, điều hướng giữa stories.
- Tương tác: API story (nếu có), props điều khiển mở/đóng modal.

### 5) `AdCarousel.jsx`
- Vai trò: Carousel quảng cáo trong sidebar phải.
- Logic chính: auto-play theo `carouselConfig`, điều hướng dot, mở link quảng cáo, xử lý loading ảnh + fallback.
- Tương tác: đọc dữ liệu từ `client/src/data/adData.js`.

### 6) `TagsFilter.jsx`
- Vai trò: Lọc feed theo từ khóa/hashtag trong nội dung bài viết.
- Logic chính: phát sự kiện `onTagsChange(tags)` lên `Feed.jsx` để áp bộ lọc.

### 7) `UserCard.jsx`, `UserProfileInfo.jsx`, `ProfileModal.jsx`, `Notification.jsx`, `Loading.jsx`, `RecentMessages.jsx`
- Vai trò: Các khối UI hỗ trợ: hiển thị user, modal profile, toast thông báo, loader, danh sách chat gần đây.
- Tương tác: props từ trang; một số kết hợp Redux (messages) hoặc SSE (thông báo).
