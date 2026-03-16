-- ============================================================
-- SEED DATA - Website Bán Laptop
-- Stack: Next.js + MySQL
-- Chạy lệnh: mysql -u root -p ten_database < seed.sql
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- 1. CATEGORY
-- ============================================================
INSERT INTO categories (id, name) VALUES
(1, 'Laptop Văn Phòng'),
(2, 'Laptop Gaming'),
(3, 'Laptop Đồ Họa'),
(4, 'Laptop Sinh Viên'),
(5, 'Laptop Mỏng Nhẹ');

-- ============================================================
-- 2. BRAND
-- ============================================================
INSERT INTO brands (id, name, logo) VALUES
(1, 'Apple',  'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'),
(2, 'Dell',   'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg'),
(3, 'ASUS',   'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg'),
(4, 'Lenovo', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Lenovo_logo_2015.svg'),
(5, 'HP',     'https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg'),
(6, 'MSI',    'https://upload.wikimedia.org/wikipedia/commons/1/1b/MSI_Logo.svg');

-- ============================================================
-- 3. PRODUCT (15 laptop thật)
-- ============================================================
INSERT INTO products (id, category_id, brand_id, name, price, description, specs, image, is_visible, created_at) VALUES

-- Apple (Mỏng nhẹ / Văn phòng)
(1, 5, 1, 'Apple MacBook Air M2 13 inch 2024',
 28990000,
 'MacBook Air M2 với màn hình Liquid Retina 13.6 inch, chip Apple M2 mạnh mẽ, thời lượng pin lên đến 18 giờ. Thiết kế siêu mỏng nhẹ chỉ 1.24kg, không quạt tản nhiệt, hoạt động hoàn toàn im lặng.',
 '{"cpu":"Apple M2 8 nhân","ram":"8GB Unified Memory","storage":"256GB SSD","gpu":"GPU 8 nhân","screen":"13.6 inch Liquid Retina 2560x1664","battery":"18 giờ","weight":"1.24kg","os":"macOS Sonoma"}',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606',
 1, NOW()),

(2, 5, 1, 'Apple MacBook Air M3 15 inch 2024',
 37990000,
 'MacBook Air 15 inch với chip M3 thế hệ mới nhất, màn hình Liquid Retina 15.3 inch rộng rãi, pin 18 giờ. Lý tưởng cho người cần màn hình lớn nhưng vẫn muốn laptop mỏng nhẹ.',
 '{"cpu":"Apple M3 8 nhân","ram":"8GB Unified Memory","storage":"256GB SSD","gpu":"GPU 10 nhân","screen":"15.3 inch Liquid Retina 2880x1864","battery":"18 giờ","weight":"1.51kg","os":"macOS Sonoma"}',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-midnight-select-202306',
 1, NOW()),

(3, 1, 1, 'Apple MacBook Pro M3 Pro 14 inch 2024',
 54990000,
 'MacBook Pro 14 inch với chip M3 Pro, màn hình Liquid Retina XDR 120Hz ProMotion. Hiệu năng chuyên nghiệp cho lập trình viên, nhà thiết kế và chỉnh sửa video 4K.',
 '{"cpu":"Apple M3 Pro 11 nhân","ram":"18GB Unified Memory","storage":"512GB SSD","gpu":"GPU 14 nhân","screen":"14.2 inch Liquid Retina XDR 3024x1964 120Hz","battery":"18 giờ","weight":"1.61kg","os":"macOS Sonoma"}',
 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202310',
 1, NOW()),

-- Dell (Văn phòng / Mỏng nhẹ)
(4, 1, 2, 'Dell XPS 13 Plus 9320 2024',
 32990000,
 'Dell XPS 13 Plus với thiết kế cao cấp, màn hình OLED 13.4 inch sắc nét, chip Intel Core i7 thế hệ 13. Bàn phím cảm ứng haptic độc đáo, vỏ nhôm nguyên khối sang trọng.',
 '{"cpu":"Intel Core i7-1360P","ram":"16GB LPDDR5","storage":"512GB SSD NVMe","gpu":"Intel Iris Xe Graphics","screen":"13.4 inch OLED 2880x1800 60Hz","battery":"12 giờ","weight":"1.27kg","os":"Windows 11 Home"}',
 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9320/media-gallery/silver/notebook-xps-13-9320-silver-gallery-3.psd',
 1, NOW()),

(5, 4, 2, 'Dell Inspiron 15 3530 2024',
 14990000,
 'Dell Inspiron 15 là lựa chọn hoàn hảo cho sinh viên với mức giá hợp lý, hiệu năng ổn định cho học tập và làm việc văn phòng. Màn hình 15.6 inch Full HD, pin bền.',
 '{"cpu":"Intel Core i5-1335U","ram":"8GB DDR4","storage":"512GB SSD","gpu":"Intel Iris Xe Graphics","screen":"15.6 inch FHD 1920x1080 120Hz","battery":"8 giờ","weight":"1.65kg","os":"Windows 11 Home"}',
 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/inspiron-15-3530/media-gallery/black/notebook-inspiron-15-3530-black-gallery-1.psd',
 1, NOW()),

-- ASUS (Gaming / Sinh viên)
(6, 2, 3, 'ASUS ROG Strix G16 2024 G614JV',
 32990000,
 'ASUS ROG Strix G16 là laptop gaming mạnh mẽ với chip Intel Core i7 thế hệ 13, RTX 4060, màn hình 165Hz. Hệ thống tản nhiệt ROG Intelligent Cooling giữ nhiệt độ ổn định khi chiến game.',
 '{"cpu":"Intel Core i7-13650HX","ram":"16GB DDR5","storage":"512GB SSD NVMe","gpu":"NVIDIA GeForce RTX 4060 8GB","screen":"16 inch FHD 1920x1080 165Hz","battery":"6 giờ","weight":"2.5kg","os":"Windows 11 Home"}',
 'https://dlcdnwebimgs.asus.com/gain/5E5DB982-E5CB-4A28-B1E0-C6EC86970D6B/w1000/h732',
 1, NOW()),

(7, 2, 3, 'ASUS ROG Zephyrus G14 2024 GA403UV',
 42990000,
 'ROG Zephyrus G14 2024 với chip AMD Ryzen 9 8945HS và RTX 4060, màn hình OLED 2.8K 120Hz tuyệt đẹp. Laptop gaming mỏng nhẹ nhất phân khúc, chỉ 1.65kg nhưng hiệu năng cực mạnh.',
 '{"cpu":"AMD Ryzen 9 8945HS","ram":"16GB LPDDR5X","storage":"1TB SSD NVMe","gpu":"NVIDIA GeForce RTX 4060 8GB","screen":"14 inch OLED 2880x1800 120Hz","battery":"10 giờ","weight":"1.65kg","os":"Windows 11 Home"}',
 'https://dlcdnwebimgs.asus.com/gain/1B53A0C8-CF0E-47D2-8389-3EBD7E1BE04F/w1000/h732',
 1, NOW()),

(8, 4, 3, 'ASUS VivoBook 15 X1504VA 2024',
 12990000,
 'ASUS VivoBook 15 là laptop sinh viên giá tốt, hiệu năng đủ dùng cho học tập, lập trình cơ bản và giải trí. Thiết kế nhỏ gọn, màu sắc trẻ trung, pin dùng cả ngày học.',
 '{"cpu":"Intel Core i5-1335U","ram":"8GB DDR4","storage":"512GB SSD","gpu":"Intel Iris Xe Graphics","screen":"15.6 inch FHD 1920x1080 60Hz","battery":"9 giờ","weight":"1.7kg","os":"Windows 11 Home"}',
 'https://dlcdnwebimgs.asus.com/gain/C8FF5C9A-D5F3-4B51-9C51-41EF9B18E6EF/w1000/h732',
 1, NOW()),

-- Lenovo (Văn phòng / Đồ họa)
(9, 1, 4, 'Lenovo ThinkPad X1 Carbon Gen 12 2024',
 38990000,
 'ThinkPad X1 Carbon Gen 12 là biểu tượng laptop doanh nhân với độ bền chuẩn MIL-SPEC, bảo mật vân tay + IR camera, bàn phím ThinkPad huyền thoại. Siêu nhẹ chỉ 1.12kg.',
 '{"cpu":"Intel Core Ultra 7 165U","ram":"16GB LPDDR5","storage":"512GB SSD NVMe","gpu":"Intel Graphics","screen":"14 inch IPS 1920x1200 400nits","battery":"15 giờ","weight":"1.12kg","os":"Windows 11 Pro"}',
 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjM4NTI3fGltYWdlL3BuZ3xoNTgvaGJlLzE0MDkxMDU4MDY1NTY2LnBuZ3w',
 1, NOW()),

(10, 3, 4, 'Lenovo ThinkPad P16 Gen 2 2024',
 52990000,
 'ThinkPad P16 là workstation di động mạnh mẽ dành cho kiến trúc sư, kỹ sư CAD/CAM, chỉnh sửa video chuyên nghiệp. Màn hình IPS 4K chuẩn màu, card đồ họa NVIDIA RTX A2000.',
 '{"cpu":"Intel Core i7-13700HX","ram":"32GB DDR5","storage":"1TB SSD NVMe","gpu":"NVIDIA RTX A2000 8GB","screen":"16 inch IPS 4K 3840x2400 165Hz","battery":"8 giờ","weight":"2.55kg","os":"Windows 11 Pro"}',
 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MTk2NjU5fGltYWdlL3BuZ3w',
 1, NOW()),

(11, 4, 4, 'Lenovo IdeaPad Slim 3 15IRH8 2024',
 11990000,
 'IdeaPad Slim 3 là laptop sinh viên giá rẻ nhưng đủ dùng, phù hợp học online, làm bài tập, xem phim. Pin 10 giờ cực bền, trọng lượng nhẹ dễ mang đi học.',
 '{"cpu":"Intel Core i5-12450H","ram":"8GB DDR4","storage":"512GB SSD","gpu":"Intel UHD Graphics","screen":"15.6 inch FHD 1920x1080 60Hz","battery":"10 giờ","weight":"1.62kg","os":"Windows 11 Home"}',
 'https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8NjkwMTF8aW1hZ2UvcG5nfA',
 1, NOW()),

-- HP (Văn phòng / Mỏng nhẹ)
(12, 5, 5, 'HP Spectre x360 14 2024',
 35990000,
 'HP Spectre x360 14 là laptop 2-in-1 cao cấp nhất của HP, màn hình OLED cảm ứng 2.8K 120Hz, có thể gập 360 độ dùng như tablet. Thiết kế gem-cut độc đáo, bút HP Tilt Pen đi kèm.',
 '{"cpu":"Intel Core Ultra 7 155H","ram":"16GB LPDDR5","storage":"512GB SSD NVMe","gpu":"Intel Arc Graphics","screen":"14 inch OLED 2880x1800 120Hz cảm ứng","battery":"17 giờ","weight":"1.57kg","os":"Windows 11 Home"}',
 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08154282.png',
 1, NOW()),

(13, 1, 5, 'HP EliteBook 840 G10 2024',
 28990000,
 'HP EliteBook 840 G10 là laptop doanh nhân cao cấp với bảo mật HP Wolf Security, màn hình Sure View chống nhìn trộm, pin 12 giờ. Chuẩn độ bền MIL-SPEC 810H.',
 '{"cpu":"Intel Core i7-1355U","ram":"16GB DDR5","storage":"512GB SSD NVMe","gpu":"Intel Iris Xe Graphics","screen":"14 inch IPS 1920x1200 400nits","battery":"12 giờ","weight":"1.34kg","os":"Windows 11 Pro"}',
 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/knowledgebase/c08250038.png',
 1, NOW()),

-- MSI (Gaming / Đồ họa)
(14, 2, 6, 'MSI Raider GE78 HX 2024',
 55990000,
 'MSI Raider GE78 HX là flagship gaming của MSI với chip Intel Core i9-14900HX, RTX 4080, màn hình QHD 240Hz. Hệ thống tản nhiệt Cooler Boost Trinity+ đỉnh cao, màn LED Matrix RGB ấn tượng.',
 '{"cpu":"Intel Core i9-14900HX","ram":"32GB DDR5","storage":"1TB SSD NVMe","gpu":"NVIDIA GeForce RTX 4080 12GB","screen":"17.3 inch QHD 2560x1440 240Hz","battery":"5 giờ","weight":"3.1kg","os":"Windows 11 Home"}',
 'https://storage-asset.msi.com/global/picture/image/feature/nb/Raider/GE78HX13V/kv.png',
 1, NOW()),

(15, 3, 6, 'MSI Creator M16 HX 2024',
 38990000,
 'MSI Creator M16 HX là laptop dành riêng cho nhà sáng tạo nội dung với màn hình Mini LED QHD+ 165Hz Delta E<2, chip Intel Core i7-14700HX, RTX 4060. Màu sắc chính xác cho công việc đồ họa.',
 '{"cpu":"Intel Core i7-14700HX","ram":"16GB DDR5","storage":"1TB SSD NVMe","gpu":"NVIDIA GeForce RTX 4060 8GB","screen":"16 inch Mini LED QHD+ 2560x1600 165Hz","battery":"8 giờ","weight":"2.2kg","os":"Windows 11 Home"}',
 'https://storage-asset.msi.com/global/picture/image/feature/nb/Creator/CreatorM16HX/kv.png',
 1, NOW());

-- ============================================================
-- 4. INVENTORY
-- ============================================================
INSERT INTO inventories (id, product_id, quantity, updated_at) VALUES
(1,  1,  25, NOW()), (2,  2,  18, NOW()), (3,  3,  10, NOW()),
(4,  4,  20, NOW()), (5,  5,  35, NOW()), (6,  6,  15, NOW()),
(7,  7,  12, NOW()), (8,  8,  40, NOW()), (9,  9,  8,  NOW()),
(10, 10, 5,  NOW()), (11, 11, 50, NOW()), (12, 12, 14, NOW()),
(13, 13, 16, NOW()), (14, 14, 6,  NOW()), (15, 15, 9,  NOW());

-- ============================================================
-- 5. USER (password: Admin@123 — đã hash bcrypt)
-- Dùng để demo, đổi hash thật khi chạy thực tế
-- bcrypt hash của "Admin@123" (sinh bởi bcryptjs):
-- ============================================================
INSERT INTO users (id, full_name, username, email, phone, password, role, is_active, created_at) VALUES
(1, 'Quản Trị Viên', 'admin',
 'admin@laptopshop.vn', '0901234567',
 '$2b$10$fDao7Tj2mUWksR9UipIfWegUvghuFiD3rWWgPva7Up4gOm5hFU72u',
 'ADMIN', 1, NOW()),

(2, 'Nguyễn Văn An', 'nguyenvanan',
 'an.nguyen@gmail.com', '0912345678',
 '$2b$10$fDao7Tj2mUWksR9UipIfWegUvghuFiD3rWWgPva7Up4gOm5hFU72u',
 'USER', 1, NOW()),

(3, 'Trần Thị Bình', 'tranthibinh',
 'binh.tran@gmail.com', '0923456789',
 '$2b$10$fDao7Tj2mUWksR9UipIfWegUvghuFiD3rWWgPva7Up4gOm5hFU72u',
 'USER', 1, NOW()),

(4, 'Lê Minh Tuấn', 'leminhtuan',
 'tuan.le@gmail.com', '0934567890',
 '$2b$10$fDao7Tj2mUWksR9UipIfWegUvghuFiD3rWWgPva7Up4gOm5hFU72u',
 'USER', 1, NOW());

-- ============================================================
-- 6. CART
-- ============================================================
INSERT INTO carts (id, user_id) VALUES
(2, 2), (3, 3), (4, 4);

-- Cart items (user đang xem nhưng chưa đặt)
INSERT INTO cart_items (id, cart_id, product_id, quantity) VALUES
(1, 2, 5,  1),   -- An đang xem Dell Inspiron
(2, 2, 8,  1),   -- An đang xem ASUS VivoBook
(3, 3, 6,  1),   -- Bình đang xem ROG Strix
(4, 4, 1,  1);   -- Tuấn đang xem MacBook Air

-- ============================================================
-- 7. ORDER (các trạng thái khác nhau để demo dashboard)
-- ============================================================
INSERT INTO orders (id, user_id, receiver_name, receiver_phone, street, city, province, payment_method, status, total, note, created_at) VALUES

-- Đơn đã giao (delivered) — để demo review
(1, 2, 'Nguyễn Văn An', '0912345678',
 '12 Nguyễn Huệ', 'Quận 1', 'TP. Hồ Chí Minh',
 'COD', 'DELIVERED', 32990000, '',
 DATE_SUB(NOW(), INTERVAL 30 DAY)),

(2, 3, 'Trần Thị Bình', '0923456789',
 '45 Lê Lợi', 'Hải Châu', 'Đà Nẵng',
 'COD', 'DELIVERED', 28990000, 'Giao giờ hành chính',
 DATE_SUB(NOW(), INTERVAL 20 DAY)),

-- Đơn đang shipping
(3, 4, 'Lê Minh Tuấn', '0934567890',
 '78 Trần Phú', 'Hoàn Kiếm', 'Hà Nội',
 'COD', 'SHIPPING', 42990000, '',
 DATE_SUB(NOW(), INTERVAL 3 DAY)),

-- Đơn đã confirmed, chờ ship
(4, 2, 'Nguyễn Văn An', '0912345678',
 '12 Nguyễn Huệ', 'Quận 1', 'TP. Hồ Chí Minh',
 'COD', 'CONFIRMED', 54990000, 'Gọi trước khi giao',
 DATE_SUB(NOW(), INTERVAL 1 DAY)),

-- Đơn mới, chờ xác nhận
(5, 3, 'Trần Thị Bình', '0923456789',
 '45 Lê Lợi', 'Hải Châu', 'Đà Nẵng',
 'COD', 'PENDING', 14990000, '',
 NOW()),

-- Đơn đã hủy
(6, 4, 'Lê Minh Tuấn', '0934567890',
 '78 Trần Phú', 'Hoàn Kiếm', 'Hà Nội',
 'COD', 'CANCELLED', 38990000, '',
 DATE_SUB(NOW(), INTERVAL 15 DAY));

-- ============================================================
-- 8. ORDER DETAIL
-- ============================================================
INSERT INTO order_details (id, order_id, product_id, quantity, price) VALUES
(1, 1, 6,  1, 32990000),   -- An mua ROG Strix
(2, 2, 4,  1, 28990000),   -- Bình mua Dell XPS 13
(3, 3, 7,  1, 42990000),   -- Tuấn mua ROG Zephyrus
(4, 4, 3,  1, 54990000),   -- An mua MacBook Pro
(5, 5, 5,  1, 14990000),   -- Bình mua Dell Inspiron
(6, 6, 9,  1, 38990000);   -- Tuấn hủy ThinkPad X1

-- ============================================================
-- 9. REVIEW (chỉ từ đơn delivered)
-- ============================================================
INSERT INTO reviews (id, user_id, product_id, rating, comment, is_verified, created_at) VALUES

(1, 2, 6, 5,
 'Máy chiến game cực mượt, ROG Strix không phụ lòng. RTX 4060 chạy Cyberpunk 2077 Ultra 60fps ổn định. Tản nhiệt tốt, sau 2 tiếng chơi liên tục nhiệt độ vẫn kiểm soát được. Bàn phím RGB đẹp, gõ phím có phản hồi tốt.',
 1, DATE_SUB(NOW(), INTERVAL 20 DAY)),

(2, 3, 4, 4,
 'Dell XPS 13 thiết kế rất đẹp và sang, màn OLED sắc nét đến mức không muốn rời mắt. Hiệu năng Core i7 làm việc văn phòng và lập trình rất ổn. Trừ 1 sao vì chỉ có 2 cổng Thunderbolt, phải mua thêm hub.',
 1, DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ============================================================
-- XONG! Kiểm tra nhanh:
-- SELECT COUNT(*) FROM products;      -- 15
-- SELECT COUNT(*) FROM users;         -- 4
-- SELECT COUNT(*) FROM orders;        -- 6
-- SELECT COUNT(*) FROM reviews;       -- 2
-- ============================================================
