# 🛒 Laptop Pro VN - Website Bán Laptop

Website thương mại điện tử bán laptop chính hãng với đầy đủ tính năng: quản lý sản phẩm, giỏ hàng, thanh toán VNPay/COD, chatbot AI tư vấn.

**Stack:** Next.js 16 (App Router) + React 19 + TailwindCSS 4 + Prisma ORM + MariaDB/MySQL + NextAuth.js v5

---

## 🔧 Yêu cầu

- **Node.js** 18+ (kiểm tra: `node -v`)
- **XAMPP** (bật **Apache** + **MySQL**)
- **npm/yarn/pnpm** (kiểm tra: `npm -v`)

---

## 🚀 Cài đặt nhanh

### 1. Clone & cài dependencies

```bash
git clone https://github.com/hieux15/laptop-shop.git
cd laptop-shop
npm install
```

### 2. Tạo file .env

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Database (MySQL trong XAMPP)
DATABASE_URL="mysql://root:@localhost:3306/laptop_shop"

# NextAuth
AUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI (cho Chatbot)
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"

# Email (tùy chọn)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER="your-email@gmail.com"
MAIL_PASS="your-app-password"
MAIL_FROM="noreply@laptoppro.vn"

# VNPay
VNPAY_TMN_CODE="your-tmn-code"
VNPAY_HASH_SECRET="your-hash-secret"
VNPAY_PAYMENT_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNPAY_RETURN_URL="http://localhost:3000/api/vnpay/vnpay-return"
```

> **Lưu ý:** Với XAMPP, mặc định user MySQL là `root`, password rỗng.  
> Nếu bạn đặt password MySQL, sửa lại `DATABASE_URL` tương ứng.

### 3. Tạo database & import dữ liệu mẫu

#### Cách 1: Dùng phpMyAdmin

1. Mở **XAMPP Control Panel** → Start **Apache** + **MySQL**
2. Vào trình duyệt: http://localhost/phpmyadmin
3. Nhấn **New** → Tạo database tên `laptop_shop`, chọn **utf8mb4_general_ci**
4. Chọn database `laptop_shop` vừa tạo
5. Nhấn tab **Import** → **Chọn file** → chọn file `seed.sql` trong thư mục dự án
6. Kéo xuống nhấn **Go** (hoặc Import) → đợi import xong

#### Cách 2: Dùng command line (nếu có MySQL CLI)

```bash
mysql -u root -p laptop_shop < seed.sql
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Chạy dev server

```bash
npm run dev
```

Mở trình duyệt: http://localhost:3000 🎉

---

## 👤 Tài khoản mặc định

| Vai trò | Email                | Mật khẩu   |
|---------|----------------------|------------|
| Admin   | admin@laptopshop.vn  | Admin@123  |
| User    | an.nguyen@gmail.com  | Admin@123  |
| User    | binh.tran@gmail.com  | Admin@123  |
| User    | tuan.le@gmail.com    | Admin@123  |

> **Admin panel:** http://localhost:3000/admin

---

### tài khoản vn pay 
Ngân hàng	NCB
Số thẻ	9704198526191432198
Tên chủ thẻ	NGUYEN VAN A
Ngày phát hành	07/15
Mật khẩu OTP	123456
## 📁 Cấu trúc thư mục

```
laptop-shop/
├── app/
│   ├── (client)/        # Giao diện khách hàng
│   │   ├── components/  # Header, Footer, ChatBot...
│   │   ├── cart/        # Giỏ hàng
│   │   ├── checkout/    # Thanh toán
│   │   ├── products/    # Trang sản phẩm
│   │   └── ...
│   ├── admin/           # Quản trị (dashboard, products, orders...)
│   ├── actions/         # Server Actions
│   ├── api/             # API Routes (auth, vnpay...)
│   └── context/         # React Context
├── lib/                 # Utilities (prisma, gemini, vnpay...)
├── prisma/              # Schema Prisma + migrations
└── public/              # Ảnh tĩnh
```

---

## 📋 Lệnh hữu ích

| Lệnh                        | Mô tả                    |
|-----------------------------|--------------------------|
| `npm run dev`               | Chạy dev server          |
| `npm run build`             | Build production         |
| `npm start`                 | Chạy production          |
| `npm test`                  | Chạy test (Vitest)       |
| `npx prisma studio`         | Mở Prisma Studio (GUI)   |
| `npx prisma generate`       | Generate Prisma Client   |

---

## 📝 Ghi chú

- **Chatbot AI:** Cần cung cấp `GOOGLE_GEMINI_API_KEY` trong `.env` để chatbot hoạt động. Lấy key tại https://aistudio.google.com/apikey
- **VNPay:** Dùng môi trường sandbox. Đăng ký test tại https://sandbox.vnpayment.vn
- **Email:** Dùng App Password của Gmail (cần bật 2FA). Xem hướng dẫn Google.