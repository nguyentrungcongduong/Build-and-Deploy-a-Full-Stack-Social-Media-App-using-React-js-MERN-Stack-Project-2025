# client/src/api

## Mục đích
Cấu hình Axios instance cho toàn bộ client, thống nhất `baseURL`, headers, và interceptor nếu cần.

## File chính

### `axios.js`
- Vai trò: Tạo một Axios instance mặc định trỏ đến `import.meta.env.VITE_BASEURL`.
- Logic chính: 
  - Tự động gắn `baseURL` cho mọi request.
  - Ở các nơi gọi API, header Authorization (Bearer) được truyền thủ công bằng token từ Clerk (`getToken`).
- Tương tác: Tất cả trang và components gọi API đều import instance này: `import api from '../api/axios'`.
