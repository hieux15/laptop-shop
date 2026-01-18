const productsData = [
  {
    id: 1,
    name: 'MacBook Pro M4 14"',
    brand: 'Apple',
    category: 'macbook',
    price: 45990000,
    originalPrice: 50990000,
    image: '/macbook.png',
    specs: {
      cpu: 'M4 chip 10-core',
      ram: '16GB',
      storage: '512GB SSD',
      display: '13.4" FHD+',
      graphics: '8-core GPU',
      battery: '52WHr, lên đến 12 giờ'
    },
    badge: 'Bán chạy',
    description: 'MacBook Pro M4 14" với chip Apple Silicon M4 mạnh mẽ, thiết kế mỏng nhẹ, màn hình Liquid Retina 13.4 inch, thời lượng pin cả ngày.',
  },
  {
    id: 2,
    name: 'Dell XPS 14 Plus',
    brand: 'Dell',
    category: 'office',
    price: 38990000,
    originalPrice: 42990000,
    rating: 4.8,
    reviews: 95,
    image: '/laptop-office.jpg',
    specs: {
      cpu: 'Intel Core i7-13700H',
      ram: '16GB',
      storage: '1TB SSD',
      display: '14" FHD+ OLED',
      graphics: 'Intel Iris Xe',
      battery: '63Wh, lên đến 10 giờ'
    },
    badge: 'Giảm giá',
    description: 'Dell XPS 14 Plus với màn hình OLED sắc nét, hiệu năng Intel Core i7 mạnh mẽ, thiết kế cao cấp, phù hợp cho công việc chuyên nghiệp.'
  },
  {
    id: 3,
    name: 'ASUS ROG Zephyrus G14',
    brand: 'ASUS',
    category: 'gaming',
    price: 52990000,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    image: '/laptop-gaming.jpg',
    specs: {
      cpu: 'AMD Ryzen 9',
      ram: '32GB DDR5',
      storage: '1TB NVMe SSD',
      display: '14" QHD+ 165Hz',
      graphics: 'NVIDIA RTX 4070',
      battery: '80Wh, lên đến 8 giờ'
    },
    badge: 'Mới',
    description: 'ASUS ROG Zephyrus G14 gaming laptop với CPU Ryzen 9 và GPU RTX 4070, màn hình QHD+ 165Hz, thiết kế mỏng nhẹ phù hợp cho gaming di động.'
  },
  {
    id: 4,
    name: 'Lenovo ThinkPad X1 Carbon',
    brand: 'Lenovo',
    category: 'office',
    price: 32490000,
    originalPrice: 35990000,
    rating: 4.9,
    reviews: 203,
    image: '/laptop-design.jpg',
    specs: {
      cpu: 'Intel Core i7',
      ram: '16GB LPDDR5',
      storage: '512GB SSD',
      display: '14" 2.8K OLED',
      graphics: 'Intel Iris Xe',
      battery: '52Wh, lên đến 11 giờ'
    },
    badge: null,
    description: 'Lenovo ThinkPad X1 Carbon laptop doanh nhân với hiệu năng Intel Core i7, màn hình OLED 2.8K, pin lâu dài, thiết kế bền và chuyên nghiệp.'
  },
  {
    id: 5,
    name: 'HP Pavilion Gaming 15',
    brand: 'HP',
    category: 'gaming',
    price: 24990000,
    originalPrice: 27990000,
    rating: 4.5,
    reviews: 87,
    image: '/laptop-gaming.jpg',
    specs: {
      cpu: 'Intel Core i5',
      ram: '16GB DDR4',
      storage: '512GB SSD',
      display: '15.6" FHD 144Hz',
      graphics: 'NVIDIA RTX 3050',
      battery: '52Wh, lên đến 7 giờ'
    },
    badge: 'Giảm giá',
    description: 'HP Pavilion Gaming 15 với màn hình 144Hz, GPU RTX 3050, CPU Intel Core i5, giá cả phải chăng cho gaming entry-level.'
  },
  {
    id: 6,
    name: 'MacBook Air M3 13"',
    brand: 'Apple',
    category: 'macbook',
    price: 29990000,
    originalPrice: null,
    rating: 4.8,
    reviews: 175,
    image: '/macbook.png',
    specs: {
      cpu: 'Apple M3 chip 8-core',
      ram: '8GB',
      storage: '256GB SSD',
      display: '13.6" Liquid Retina',
      graphics: '8-core GPU',
      battery: '52.6WHr, lên đến 15 giờ'
    },
    badge: 'Bán chạy',
    description: 'MacBook Air M3 13" với chip M3 tiết kiệm năng lượng, thiết kế siêu mỏng nhẹ, hiệu suất tuyệt vời, lý tưởng cho sinh viên và người dùng bình thường.'
  },
  {
    id: 7,
    name: 'ASUS Vivobook Pro 15',
    brand: 'ASUS',
    category: 'design',
    price: 21990000,
    originalPrice: 24990000,
    rating: 4.6,
    reviews: 64,
    image: '/laptop-design.jpg',
    specs: {
      cpu: 'AMD Ryzen 7',
      ram: '16GB DDR5',
      storage: '512GB SSD',
      display: '15.6" OLED 2.8K',
      graphics: 'AMD Radeon',
      battery: '70Wh, lên đến 9 giờ'
    },
    badge: null,
    description: 'ASUS Vivobook Pro 15 với màn hình OLED 2.8K đẹp mắt, CPU Ryzen 7 mạnh mẽ, thích hợp cho thiết kế và chỉnh sửa hình ảnh.'
  },
  {
    id: 8,
    name: 'Acer Predator Helios 16',
    brand: 'Acer',
    category: 'gaming',
    price: 44990000,
    originalPrice: null,
    rating: 4.7,
    reviews: 112,
    image: '/laptop-gaming.jpg',
    specs: {
      cpu: 'Intel Core i9',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      display: '16" FHD+ 165Hz',
      graphics: 'NVIDIA RTX 4060',
      battery: '80Wh, lên đến 6 giờ'
    },
    badge: 'Mới',
    description: 'Acer Predator Helios 16 gaming laptop cao cấp với CPU i9, GPU RTX 4060, màn hình 165Hz lớn, hiệu suất gaming cao nhất.'
  },
  {
    id: 9,
    name: 'Dell Inspiron 15 3520',
    brand: 'Dell',
    category: 'office',
    price: 15990000,
    originalPrice: 17990000,
    rating: 4.4,
    reviews: 145,
    image: '/laptop-office.jpg',
    specs: {
      cpu: 'Intel Core i5',
      ram: '8GB DDR4',
      storage: '512GB SSD',
      display: '15.6" FHD',
      graphics: 'Intel UHD Graphics',
      battery: '42Wh, lên đến 7 giờ'
    },
    badge: 'Giá rẻ',
    description: 'Dell Inspiron 15 3520 laptop giá rẻ thích hợp cho học tập và công việc văn phòng cơ bản với CPU i5 và RAM 8GB.'
  },
  {
    id: 10,
    name: 'Lenovo Legion 5 Pro',
    brand: 'Lenovo',
    category: 'gaming',
    price: 39990000,
    originalPrice: 43990000,
    rating: 4.8,
    reviews: 198,
    image: '/laptop-gaming.jpg',
    specs: {
      cpu: 'AMD Ryzen 7',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      display: '16" QHD+ 165Hz',
      graphics: 'NVIDIA RTX 4060',
      battery: '80Wh, lên đến 8 giờ'
    },
    badge: 'Bán chạy',
    description: 'Lenovo Legion 5 Pro laptop gaming mạnh mẽ với CPU Ryzen 7, màn hình QHD+ 165Hz, GPU RTX 4060, hiệu năng tuyệt vời cho gaming và công việc nặng.'
  }
];

const categories = [
  { id: 'all', name: 'Tất cả', count: 10 },
  { id: 'gaming', name: 'Laptop Gaming', count: 4 },
  { id: 'office', name: 'Laptop Văn phòng', count: 3 },
  { id: 'macbook', name: 'MacBook', count: 2 },
  { id: 'design', name: 'Laptop Đồ họa', count: 1 },
];

const brands = [
  { id: 'all', name: 'Tất cả thương hiệu' },
  { id: 'Apple', name: 'Apple' },
  { id: 'Dell', name: 'Dell' },
  { id: 'ASUS', name: 'ASUS' },
  { id: 'Lenovo', name: 'Lenovo' },
  { id: 'HP', name: 'HP' },
  { id: 'Acer', name: 'Acer' },
];

const priceRanges = [
  { id: 'all', name: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under20', name: 'Dưới 20 triệu', min: 0, max: 20000000 },
  { id: '20to30', name: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { id: '30to40', name: '30 - 40 triệu', min: 30000000, max: 40000000 },
  { id: 'above40', name: 'Trên 40 triệu', min: 40000000, max: Infinity },
];

export default productsData;
export { productsData, categories, brands, priceRanges };

