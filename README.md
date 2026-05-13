# Laptop Pro VN - Website Bán Laptop

Website thương mại điện tử bán laptop chính hãng với đầy đủ tính năng quản lý sản phẩm, giỏ hàng, thanh toán và hỗ trợ khách hàng bằng AI.

## Tính năng chính

### Khách hàng
- **Trang chủ**: Hiển thị sản phẩm nổi bật, danh mục laptop, đánh giá khách hàng
- **Danh sách sản phẩm**: Lọc theo danh mục (Gaming, Văn phòng, Mỏng nhẹ, Đồ họa), thương hiệu
- **Chi tiết sản phẩm**: Thông số kỹ thuật, đánh giá, so sánh
- **Giỏ hàng**: Quản lý sản phẩm, tính toán giá trị
- **So sánh sản phẩm**: So sánh thông số kỹ thuật nhiều sản phẩm
- **Đặt hàng**: Điền thông tin giao hàng, chọn phương thức thanh toán
- **Thanh toán**: Tích hợp VNPay và COD
- **Mã giảm giá**: Áp dụng voucher giảm giá
- **Quản lý đơn hàng**: Xem lịch sử đơn hàng, trạng thái
- **Chatbot AI**: Tư vấn sản phẩm thông minh bằng Google Gemini AI

### Quản trị viên
- **Dashboard**: Thống kê doanh thu, đơn hàng, sản phẩm, người dùng
- **Biểu đồ**: Doanh thu theo ngày/tháng (Recharts)
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm với hình ảnh và thông số
- **Quản lý danh mục**: Thêm/sửa/xóa danh mục sản phẩm
- **Quản lý thương hiệu**: Thêm/sửa/xóa thương hiệu
- **Quản lý tồn kho**: Cập nhật số lượng tồn kho
- **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng
- **Quản lý người dùng**: Xem danh sách, kích hoạt/vô hiệu hóa
- **Quản lý voucher**: Tạo mã giảm giá, theo dõi sử dụng
- **Xuất báo cáo**: Xuất dữ liệu sang Excel

### Công nghệ
- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MariaDB/MySQL
- **Authentication**: NextAuth.js v5 với JWT
- **Payment**: VNPay Integration
- **AI**: Google Gemini AI (Chatbot tư vấn)
- **Email**: Nodemailer
- **Charts**: Recharts
- **Icons**: Lucide React

## Cài đặt

### Yêu cầu
- Node.js 18+
- MariaDB hoặc MySQL
- npm, yarn, pnpm hoặc bun

### Bước 1: Clone repository
```bash
git clone https://github.com/hieux15/laptop-shop.git
cd laptop-shop
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

### Bước 3: Cấu hình biến môi trường
Tạo file `.env` trong thư mục gốc:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/laptop_shop"

# NextAuth
AUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI (cho Chatbot)
GOOGLE_GEMINI_API_KEY="your-gemini-api-key"

# Email (Nodemailer) - tùy chọn
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

### Bước 4: Khởi tạo database
```bash
npx prisma generate
npx prisma migrate dev
```

### Bước 5: Seed dữ liệu (tùy chọn)
```bash
# Chạy file seed.sql trong thư mục gốc
mysql -u root -p laptop_shop < seed.sql
```

### Bước 6: Chạy development server
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

## Tài khoản mặc định

**Admin**:
- Email: admin@example.com
- Mật khẩu: admin123

**User**:
- Email: user@example.com
- Mật khẩu: user123

## Cấu trúc dự án

```
laptop-shop/
├── app/
│   ├── (client)/          # Pages khách hàng
│   │   ├── components/    # Components client (ChatBot, Header, Footer...)
│   │   ├── cart/          # Giỏ hàng
│   │   ├── checkout/      # Thanh toán
│   │   ├── products/      # Sản phẩm
│   │   └── ...
│   ├── admin/             # Pages quản trị
│   │   ├── products/      # Quản lý sản phẩm
│   │   ├── orders/        # Quản lý đơn hàng
│   │   └── ...
│   ├── actions/           # Server Actions
│   ├── api/               # API Routes
│   └── context/           # Context Providers
├── lib/                   # Utilities
├── prisma/                # Database schema & migrations
└── public/                # Static assets
```

## Lệnh hữu ích

```bash
# Development
npm run dev

# Build production
npm run build

# Start production
npm start

# Database
npx prisma studio          # Mở Prisma Studio
npx prisma migrate dev     # Tạo migration
npx prisma generate        # Generate Prisma Client
```

## License

ISC
