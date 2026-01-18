import Link from 'next/link';
import Image from 'next/image';
import {Laptop, Shield, Truck, Headphones, ArrowRight, Star } from 'lucide-react';
import productsData from './data/products.js';
import { ProductCard } from './components/ProductCard.js';

export default function Home() {
  // Get featured products (with badge 'Bán chạy' or 'Mới')
  const featuredProducts = productsData.filter(p => p.badge === 'Bán chạy' || p.badge === 'Mới').slice(0, 4);
  
  // Categories data
  const categories = [
    {
      name: 'Laptop Gaming',
      href: '/products?category=gaming',
      img: '/laptop-gaming.jpg'
    },
    {
      name: 'Laptop Văn phòng',
      href: '/products?category=office',
      img: '/laptop-office.jpg'
    },
    {
      name: 'MacBook',
      href: '/products?category=macbook',
      img: '/macbook.png'
    },
    {
      name: 'Laptop Đồ họa',
      href: '/products?category=design',
      img: '/laptop-design.jpg'
    }
  ];

  return (
    <div>
      <section className="relative bg-linear-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Laptop Chính Hãng – Giá Tốt Nhất
            </h1>
            <p className="mt-6 text-xl opacity-90">
              Khám phá hàng ngàn mẫu laptop từ MacBook, Dell, ASUS, Lenovo... với bảo hành chính hãng và ưu đãi độc quyền.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition flex items-center justify-center gap-2 text-lg"
              >
                Xem tất cả sản phẩm <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="text-center border-2 border-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-700 transition text-lg"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
          <div className=" hidden md:block relative w-full md:w-1/2 h-80 md:h-96">
            <Image
              src="/laptop2.jpg"
              alt="Laptop Collection"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Laptop className="h-10 w-10 md:h-12 md:w-12 text-blue-600 " />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Sản phẩm chính hãng
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                100% laptop chính hãng từ nhà phân phối uy tín
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Shield className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Bảo hành tận tâm
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                Bảo hành chính hãng 12–24 tháng, hỗ trợ 1-1
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-yellow-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Truck className="h-10 w-10 md:h-12 md:w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Giao hàng nhanh
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                Giao hàng miễn phí toàn quốc trong 24–48h
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Headphones className="h-10 w-10 md:h-12 md:w-12 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Hỗ trợ 24/7
              </h3>
              <p className="text-gray-600 text-base md:text-lg">
                Tư vấn nhiệt tình – hỗ trợ mọi lúc mọi nơi
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-30 p-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Danh mục nổi bật
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="bg-gray-100 rounded-xl p-6 text-center hover:shadow-lg transition hover:scale-105"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="mx-auto mb-4 h-24 w-24 object-contain"
                />
                <h3 className="font-semibold text-lg">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Sản phẩm nổi bật
          </h2>
          <p className="text-lg text-center mb-16">Khám phá những mẫu laptop bán chạy nhất với đánh giá cao từ khách hàng của chúng tôi. Đảm bảo hiệu năng vượt trội và thiết kế tinh tế cho mọi nhu cầu sử dụng.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products" className="text-blue-600 font-semibold hover:underline">
              Xem thêm sản phẩm →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-linear-to-r from-indigo-600 to-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Sẵn sàng sở hữu laptop mơ ước?</h2>
          <p className="text-xl mb-10 opacity-90">
            Đặt hàng ngay hôm nay để nhận ưu đãi giảm đến 10% + quà tặng kèm.
          </p>
          <Link
            href="/products"
            className="bg-white text-indigo-700 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition inline-flex items-center gap-3"
          >
            Mua ngay <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}