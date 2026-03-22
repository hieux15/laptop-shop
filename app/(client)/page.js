import Link from 'next/link';
import Image from 'next/image';
import { Laptop, Shield, Truck, Headphones, ArrowRight, Star, Zap, CheckCircle, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/productUtils';
import { ProductCard } from './components/ProductCard';

export default async function Home() {
  let featuredProducts = [];
  try {
    const raw = await prisma.product.findMany({
  where: { isVisible: true },
  include: { brand: true, category: true },
});

featuredProducts = raw
  .map(serializeProduct)
  .sort((a, b) => {
    // Tiêu chí 1: Có giảm giá lên trước
    const aHasDiscount = a.originalPrice > a.price ? 1 : 0;
    const bHasDiscount = b.originalPrice > b.price ? 1 : 0;
    if (bHasDiscount !== aHasDiscount) return bHasDiscount - aHasDiscount;

    // Tiêu chí 2: % giảm giá cao hơn
    const aDiscount = aHasDiscount ? (a.originalPrice - a.price) / a.originalPrice : 0;
    const bDiscount = bHasDiscount ? (b.originalPrice - b.price) / b.originalPrice : 0;
    if (bDiscount !== aDiscount) return bDiscount - aDiscount;

    // Tiêu chí 3: Mới nhất
    return new Date(b.createdAt) - new Date(a.createdAt);
  })
  .slice(0, 4);
  } catch (e) {
    console.error('Failed to fetch featured products:', e);
  }
  // danh mục sản phẩm
const categories = [
    {
      name: 'Laptop Gaming',
      href: '/products?category=laptop-gaming',
      img: '/laptop-gaming.jpg',
      desc: 'Hiệu năng cao, tản nhiệt mạnh',
      accent: 'bg-red-50 border-red-100 group-hover:border-red-300',
      iconBg: 'bg-red-100',
    },
    {
      name: 'Laptop Văn Phòng',
      href: '/products?category=laptop-van-phong',
      img: '/laptop-office.jpg',
      desc: 'Mỏng nhẹ, pin trâu, cơ động',
      accent: 'bg-blue-50 border-blue-100 group-hover:border-blue-300',
      iconBg: 'bg-blue-100',
    },
    {
      name: 'Laptop Mỏng Nhẹ',
      href: '/products?category=laptop-mong-nhe',
      img: '/macbook.png',
      desc: 'Thiết kế sang trọng, cao cấp',
      accent: 'bg-slate-50 border-slate-200 group-hover:border-slate-400',
      iconBg: 'bg-slate-100',
    },
    {
      name: 'Laptop Đồ Họa',
      href: '/products?category=laptop-do-hoa',
      img: '/laptop-design.jpg',
      desc: 'Màn hình chuẩn màu, GPU mạnh',
      accent: 'bg-violet-50 border-violet-100 group-hover:border-violet-300',
      iconBg: 'bg-violet-100',
    },
  ];

    const testimonials = [
    {
      name: 'Nguyễn Minh Tuấn',
      role: 'Lập trình viên',
      content: 'Mua MacBook Pro M3 tại đây, giá tốt hơn Apple Store chính thức mà vẫn chính hãng. Giao hàng nhanh chóng, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/80?u=10',
    },
    {
      name: 'Trần Thị Lan',
      role: 'Kiến trúc sư',
      content: 'Laptop gaming ASUS chạy cực mượt. Nhân viên tư vấn rất am hiểu, giúp tôi chọn đúng máy phù hợp với nhu cầu đồ họa 3D. Cực kỳ hài lòng!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/80?u=20',
    },
    {
      name: 'Lê Hoàng Phúc',
      role: 'Sinh viên CNTT',
      content: 'Được tư vấn nhiệt tình, chọn được chiếc Dell vừa túi tiền vừa đáp ứng nhu cầu học tập. Bảo hành tại chỗ rất tiện. Recommend cho mọi người!',
      rating: 5,
      avatar: 'https://i.pravatar.cc/80?u=30',
    },
  ];

  const brands = ['Asus', 'Dell', 'HP', 'Lenovo', 'Apple', 'MSI', 'Acer', 'LG'];

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

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Dòng sản phẩm</p>
              <h2 className="text-4xl font-extrabold text-slate-900">Danh mục nổi bật</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
              Xem tất cả <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={`group relative ${cat.accent} border-2 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className={`relative h-28 w-28 mx-auto mb-5 rounded-xl ${cat.iconBg} flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain p-2"
                  />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{cat.name}</h3>
                <p className="text-slate-500 text-xs">{cat.desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                  Xem ngay <ChevronRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Đang bán chạy</p>
              <h2 className="text-4xl font-extrabold text-slate-900">Sản phẩm nổi bật</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all">
              Xem tất cả <ChevronRight size={18} />
            </Link>
          </div>
          <p className="text-slate-500 mb-12 max-w-2xl">
            Những mẫu laptop được khách hàng yêu thích nhất – hiệu năng vượt trội, thiết kế tinh tế, phù hợp mọi nhu cầu sử dụng.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-10">
            Thương hiệu phân phối chính hãng
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {brands.map((brand) => (
              <span key={brand} className="text-2xl font-extrabold text-slate-300 hover:text-slate-500 transition-colors cursor-default tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-3">Khách hàng nói gì?</p>
            <h2 className="text-4xl font-extrabold text-slate-900">Đánh giá thực tế</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex text-yellow-400 mb-5">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed flex-1 mb-7 text-sm">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <Image src={t.avatar} alt={t.name} width={44} height={44} className="rounded-full" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                  <CheckCircle size={18} className="ml-auto text-emerald-500 shrink-0" />
                </div>
              </div>
            ))}
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