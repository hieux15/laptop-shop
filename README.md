# 🛒 Laptop Pro VN - Website Bán Laptop

Website thương mại điện tử bán laptop chính hãng với đầy đủ tính năng: quản lý sản phẩm, giỏ hàng, thanh toán VNPay/COD, chatbot AI tư vấn.

**Stack:** Next.js 16 (App Router) + React 19 + TailwindCSS 4 + Prisma 6 ORM + PostgreSQL (Supabase Cloud) + NextAuth.js v5

> 🌐 **Demo trực tuyến:** https://laptop-shop-eight.vercel.app/

---

## 🔧 Yêu cầu

- **Node.js** 18+ (kiểm tra: `node -v`)
- **npm/yarn/pnpm** (kiểm tra: `npm -v`)
- **Tài khoản Supabase** miễn phí tại https://supabase.com (dùng database PostgreSQL trên cloud)

---

## 🚀 Cài đặt nhanh

### 1. Clone & cài dependencies

```bash
git clone https://github.com/hieux15/laptop-shop.git
cd laptop-shop
npm install
```

### 2. Tạo project Supabase

1. Đăng nhập vào https://supabase.com/dashboard → **New project**
2. Đặt tên project, chọn **Database Password** (nhớ kỹ) và **Region** gần bạn nhất
3. Sau khi tạo xong, vào **Project Settings → Database → Connection strings**
4. Copy **Session pooler** connection string (dạng `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`)

### 3. Tạo file .env

Tạo file `.env` trong thư mục gốc với nội dung:

```env
# Database (Supabase Cloud - PostgreSQL)
DATABASE_URL="postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

# NextAuth (generate secret: openssl rand -base64 32)
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

# VNPay Sandbox
VNP_TMNCODE="your-tmn-code"
VNP_HASHSECRET="your-hash-secret"
VNP_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
VNP_API="https://sandbox.vnpayment.vn/merchant_webapi/api/transaction"
VNP_RETURNURL="http://localhost:3000/api/vnpay/vnpay-return"
```

> **Lưu ý quan trọng:**
> - `<project-ref>` là mã project trong Supabase (ví dụ `moeomryujgebszomjpnk`), nằm trong URL dashboard.
> - `<region>` theo format của Supabase (ví dụ `ap-northeast-1` = Tokyo, `ap-southeast-1` = Singapore).
> - Port `5432` = Connection Pooler, dùng trong production để tránh giới hạn kết nối.
> - Port `6543` = Session pooler, dùng với Prisma khi cần (kiểm tra bảng **Connection strings** trong Dashboard).
> - **Không commit file `.env` lên Git** — đảm bảo nó nằm trong `.gitignore`.

### 4. Đồng bộ schema lên database

```bash
npx prisma db push
```

Lệnh này sẽ tạo toàn bộ bảng theo `prisma/schema.prisma` trên Supabase.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Chạy dev server

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

### Tài khoản VNPay Sandbox (NCB)

| Thông tin | Giá trị |
|-----------|---------|
| Ngân hàng | NCB |
| Số thẻ | 9704198526191432198 |
| Tên chủ thẻ | NGUYEN VAN A |
| Ngày phát hành | 07/15 |
| Mật khẩu OTP | 123456 |

---

## 🎬 Video demo

Demo mua hàng & thanh toán VNPay:

[![Xem video demo mua hàng & thanh toán VNPay](https://img.youtube.com/vi/s63vhzSamzU/0.jpg)](https://youtu.be/s63vhzSamzU)

---

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
| `npx prisma db push`        | Đồng bộ schema lên DB    |

---

## 📝 Ghi chú

- **Chatbot AI:** Cần cung cấp `GOOGLE_GEMINI_API_KEY` trong `.env` để chatbot hoạt động. Lấy key tại https://aistudio.google.com/apikey
- **VNPay:** Dùng môi trường sandbox. Đăng ký test tại https://sandbox.vnpayment.vn
- **Email:** Dùng App Password của Gmail (cần bật 2FA). Xem hướng dẫn Google.
- **Database:** Project dùng **Supabase Cloud** (PostgreSQL). Nếu project Supabase bị **Pause** sau 7 ngày không hoạt động (gói free), vào Dashboard → **Restore project** trước khi dùng.
- **Migration:** Khi thay đổi model trong `prisma/schema.prisma`, chạy `npx prisma migrate dev --name <tên>` để tạo migration mới, hoặc `npx prisma db push` để đồng bộ nhanh (dev only).