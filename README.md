
# FOODIE FINDER BACKEND

Backend app cho capstone 1


## Tech Stack

**Web module:** NodeJS, Express, Mongodb

**Recommedation Module:** Python

## Cấu trúc dự án

| Thư mục             | Ý nghĩa                                                                |
| ----------------- | ------------------------------------------------------------------ |
| config | Chứa các app configuration để kết nối với các bên thứ ba như Mongodb, MailService, etc... |
| constants | Định nghĩa các const được dùng cho dự án |
| controllers | chứa logic backend|
| cronjobs | chứa các task được lên lịch (nếu có) |
| libs | các cấu hình cho express, socket, ... |
| models | Mongoose schema |
| routes | Định tuyến API |
| utils | Chứa các function hoặc class hữu ích cho dự án |


## Luồng hoạt động

- Bắt đầu từ file Server.js
- Server.js gọi tới app từ express. App express bao gồm các config để sử dụng các thư viện cần thiết cho ứng dụng và globalHandlerError để xử lý lỗi
- Request đi vào ứng dụng, qua hệ thống router sẽ tìm dược controller xử lý tương ứng. Trong controller nếu xử lý thành công sẽ trả về response cho fe, nếu thất bại sẽ ném ra một lỗi (AppError). AppError này sẽ được chuyển tới globalHandlerError để xử lý và trả về lỗi cho fe 


