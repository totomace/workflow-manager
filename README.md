# TaskFlow - Workflow Manager

Ứng dụng quản lý công việc cá nhân, theo dõi thu nhập theo task với dashboard thống kê mạnh mẽ.  
Được xây dựng bằng **React (Vite) + Express + PostgreSQL**, triển khai miễn phí trên **Vercel + Render + Neon**.

## 🚀 Tính năng

- 🔐 **Xác thực người dùng**: Đăng ký / Đăng nhập bằng email & mật khẩu hoặc Google OAuth.
- 📋 **Quản lý task**: Thêm, sửa, xóa, tìm kiếm, lọc theo trạng thái (Cần làm, Đang làm, Hoàn thành).
- 📅 **Ngày & Giờ làm việc**: Gắn ngày làm, giờ bắt đầu và giờ kết thúc cho mỗi task.
- 💰 **Theo dõi thu nhập**: Gắn số tiền kiếm được cho mỗi task hoàn thành, tự động format VNĐ.
- 📊 **Thống kê trực quan**:
  - Biểu đồ tròn thống kê trạng thái task theo thời gian (tuần/tháng/năm/tất cả).
  - Card thu nhập theo tuần/tháng/năm/tất cả, hiển thị khoảng thời gian cụ thể.
- ⚡ **Cập nhật thời gian thực**: Sử dụng Socket.IO để đồng bộ dữ liệu giữa các thiết bị.
- 🌙 **Dark mode / Light mode**: Chuyển đổi giao diện sáng tối.
- 📱 **Responsive**: Giao diện tương thích mobile, tablet, desktop.
- 🛡️ **Form validation**: Sử dụng react-hook-form + zod để kiểm tra dữ liệu nhập.
- ⏳ **Skeleton loading**: Hiển thị khung xương khi tải dữ liệu.
- 🔔 **Toast notifications**: Thông báo thành công / lỗi khi thao tác.
- 🎨 **Animation**: Hiệu ứng chuyển trang và phần tử bằng framer-motion.
- 👤 **Hồ sơ người dùng**: Cập nhật tên, đổi mật khẩu.

## 🛠️ Công nghệ sử dụng

| Lớp | Công nghệ |
|------|-----------|
| **Frontend** | React 19 (Vite), Tailwind CSS, Lucide React, Framer Motion, Recharts, React Hook Form, Zod |
| **Backend** | Node.js, Express, Socket.IO, JWT (jsonwebtoken), bcrypt, Google Auth Library |
| **Database** | PostgreSQL (Neon serverless) |
| **Real-time** | Socket.IO |
| **Triển khai** | Vercel (frontend), Render (backend), Neon (database) |

## 📁 Cấu trúc dự án
workflow-manager/
├── backend/
│ ├── src/
│ │ ├── config/db.js
│ │ ├── middleware/auth.middleware.js
│ │ ├── modules/
│ │ │ ├── auth/
│ │ │ ├── tasks/
│ │ │ └── users/
│ │ ├── socket.js
│ │ └── app.js
│ ├── .env
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── api/client.js
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ └── Profile.jsx
│ │ ├── schemas/
│ │ └── socket.js
│ ├── .env.production
│ ├── vercel.json
│ └── package.json
├── docker-compose.yml
└── README.md


## 🚦 Cài đặt & Chạy local

### Yêu cầu

- Node.js 18+
- PostgreSQL (có thể dùng Docker hoặc [Neon](https://neon.tech))

### 1. Clone repository

```bash
git clone https://github.com/your-username/workflow-manager.git
cd workflow-manager

2. Cài đặt và chạy Backend
cd backend
npm install
cp .env.example .env   # Tạo file .env, điền các biến môi trường cần thiết
npm run dev

Backend sẽ chạy tại http://localhost:5000.

3. Cài đặt và chạy Frontend
cd frontend
npm install
npm run dev

Frontend sẽ chạy tại http://localhost:5173.

Lưu ý: Đảm bảo database PostgreSQL đã được tạo và có các bảng users, tasks.
Nếu dùng Docker, chạy docker-compose up -d từ thư mục gốc để khởi động PostgreSQL.

🌐 Triển khai (Miễn phí)
Database (Neon)
Tạo tài khoản tại Neon.

Tạo project mới, lấy connection string.

Chạy các lệnh SQL trong Neon SQL Editor để tạo bảng users và tasks.

Backend (Render)
Push code lên GitHub.

Vào Render, tạo New Web Service, kết nối repo.

Cấu hình:

Root Directory: backend

Build Command: npm install

Start Command: node src/app.js

Environment Variables: DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, PORT

Deploy, lấy URL backend (dạng https://taskflow-api-xxxx.onrender.com).

Frontend (Vercel)
Vào Vercel, import project từ GitHub.

Cấu hình:

Root Directory: frontend

Build Command: npm run build

Output Directory: dist

Environment Variable: VITE_API_BASE_URL = URL backend + /api/v1

Deploy, lấy URL frontend (dạng https://workflow-manager-xxxx.vercel.app).

CORS & Google OAuth: Cập nhật domain Vercel vào allowedOrigins trong backend/src/app.js và Authorized JavaScript origins trong Google Cloud Console.

🌍 Demo
Web App: https://workflow-manager-theta.vercel.app

API: https://taskflow-api-q1uk.onrender.com/api/v1

📝 Tác giả
Totomace – GitHub

📄 License
MIT License