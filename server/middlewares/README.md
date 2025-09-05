# server/middlewares

## Mục đích
Chứa các middleware Express, ví dụ xác thực token, xử lý lỗi, hoặc các bộ lọc request.

## File chính
- `auth.js`: Xác thực request dựa trên Bearer token (Clerk/JWT) trong header `Authorization`. Nếu hợp lệ, gán thông tin user vào `req.user` để controller sử dụng.

## Dòng chảy
- Request -> `auth` (nếu route yêu cầu) -> controller xử lý -> response.

## Mối liên hệ
- Được sử dụng trong `server/routes/*` khi cần bảo vệ endpoint.
