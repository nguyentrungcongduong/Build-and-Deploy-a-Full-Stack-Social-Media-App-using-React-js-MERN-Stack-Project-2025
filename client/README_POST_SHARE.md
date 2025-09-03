# Tính năng Post Share - Hướng dẫn sử dụng

## Mô tả
Tính năng này cho phép người dùng chia sẻ link bài viết và khi người khác truy cập vào link đó, họ sẽ thấy bài viết ngay cả khi chưa đăng nhập. Sau khi đăng nhập, bài viết đó sẽ được hiển thị ở đầu trang chủ của họ.

## Cách hoạt động

### 1. Khi user chưa đăng nhập truy cập link post share:
- User được chuyển đến trang `PublicPost` 
- `postId` được lưu vào `localStorage` với key `redirectPostId`
- User có thể xem bài viết nhưng không thể thực hiện các hành động cần đăng nhập

### 2. Khi user thực hiện hành động cần đăng nhập:
- Nếu user nhấn like, comment, hoặc các hành động khác
- `postId` được lưu vào `localStorage` (nếu chưa có)
- User được chuyển đến trang đăng nhập

### 3. Sau khi đăng nhập thành công:
- User được chuyển về trang chủ (`/`)
- `Feed` component sẽ kiểm tra `redirectPostId` trong `localStorage`
- Nếu tìm thấy bài post trong feed, nó sẽ được đưa lên đầu danh sách
- Hiển thị thông báo thành công
- Tự động scroll đến đầu trang
- Xóa `redirectPostId` khỏi `localStorage`

## Các file liên quan

### `App.jsx`
- Xử lý redirect về trang chủ khi có `redirectPostId`
- Không xóa `redirectPostId` ngay lập tức

### `PublicPost.jsx`
- Lưu `postId` vào `localStorage` khi user chưa đăng nhập
- Hiển thị bài viết với `PostCard` component

### `PostCard.jsx`
- Lưu `postId` vào `localStorage` khi user thực hiện hành động cần đăng nhập
- Hiển thị thông báo rõ ràng về việc bài viết sẽ được hiển thị ở trang chủ

### `Feed.jsx`
- Xử lý `redirectPostId` sau khi feeds được load
- Đưa bài post được share lên đầu danh sách
- Hiển thị thông báo và scroll đến đầu trang
- Xóa `redirectPostId` sau khi xử lý xong

## Luồng hoạt động chi tiết

```
User truy cập link post share
         ↓
   PublicPost component
         ↓
   Lưu postId vào localStorage
         ↓
   User thực hiện hành động cần đăng nhập
         ↓
   Chuyển đến trang đăng nhập
         ↓
   User đăng nhập thành công
         ↓
   Chuyển về trang chủ
         ↓
   Feed component load
         ↓
   Kiểm tra redirectPostId
         ↓
   Đưa bài post lên đầu danh sách
         ↓
   Hiển thị thông báo và scroll
         ↓
   Xóa redirectPostId
```

## Lưu ý kỹ thuật

1. **State Management**: Sử dụng `redirectPostHandled` state để đảm bảo logic chỉ chạy một lần
2. **Error Handling**: Xử lý lỗi localStorage một cách graceful
3. **User Experience**: Tự động scroll và hiển thị thông báo rõ ràng
4. **Performance**: Chỉ xử lý khi feeds đã được load

## Testing

Để test tính năng này:
1. Mở link post share trong trình duyệt ẩn danh
2. Thực hiện hành động cần đăng nhập (like, comment)
3. Đăng nhập với tài khoản hợp lệ
4. Kiểm tra xem bài post có được hiển thị ở đầu trang chủ không
