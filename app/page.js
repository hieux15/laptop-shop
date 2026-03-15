import Link from 'next/link';
import Image from 'next/image';
import {Laptop, Shield, Truck, Headphones, ArrowRight, Star } from 'lucide-react';
import { productsData } from './data/products.js';
import { ProductCard } from './components/ProductCard.js';

export default function Home() {
  // lấy sản phẩm nổi bật (với badge 'Bán chạy' hoặc 'Mới')
  const featuredProducts = productsData.filter(p => p.badge === 'Bán chạy' || p.badge === 'Mới').slice(0, 4);
  
  // danh mục sản phẩm
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
      <section className="relative min-h-[80vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-indigo-900/60 mix-blend-multiply" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-1.5 mb-6 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 rounded-full text-blue-200 text-sm font-bold tracking-wider">
              LapProVN - Công nghệ dẫn đầu
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Laptop Đẳng Cấp <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                Giá Trị Đích Thực
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-10 leading-relaxed text-gray-200">
              Nâng tầm trải nghiệm làm việc và giải trí với những dòng laptop chính hãng mới nhất. Cam kết giá tốt nhất thị trường cùng chế độ bảo hành vàng.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/products"
                className="group relative bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold transition-all 
                hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Khám phá ngay</span>
                <ArrowRight className="h-6 w-6 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white 
                hover:text-blue-900 transition-all hover:scale-105 active:scale-95 text-lg flex items-center justify-center shadow-lg hover:shadow-white/20"
              >
                Nhận tư vấn miễn phí
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-blue-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                    <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="User" width={48} height={48} />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400 mb-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-300"><b>5000+</b> khách hàng đã tin tưởng</p>
              </div>
            </div>
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
                <div className="relative h-24 w-24 mx-auto mb-4">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain"
                  />
                </div>
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
          
          <div className="text-center mt-16">
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all hover:scale-105"
            >
              Xem tất cả sản phẩm <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
            alt="CTA Background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-indigo-900/60 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Sẵn sàng sở hữu laptop mơ ước?</h2>
          <p className="text-xl mb-10 opacity-90 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Đặt hàng ngay hôm nay để nhận ưu đãi giảm đến 10% cùng bộ quà tặng công nghệ trị giá 2.000.000đ.
          </p>
          <Link
            href="/products"
            className="group relative bg-white text-indigo-700 px-10 py-5 rounded-full font-extrabold text-xl hover:bg-blue-50 
            transition-all hover:scale-110 active:scale-95 inline-flex items-center gap-3 shadow-2xl hover:shadow-indigo-500/50 overflow-hidden"
          >
            Mua ngay <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}