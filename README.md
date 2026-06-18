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
