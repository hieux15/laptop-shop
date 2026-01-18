import { Laptop, Award, Users, Headphones, Target, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="relative bg-linear-to-br from-blue-600 to-indigo-700 text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Về Chúng Tôi
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Đơn vị tiên phong mang đến laptop chính hãng, giá tốt nhất và dịch vụ tận tâm cho người dùng Việt Nam.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Câu chuyện của LapProVN
              </h2>
              <div className="space-y-5 text-gray-700 text-base md:text-lg leading-relaxed">
                <p>
                  LapProVN được thành lập với sứ mệnh mang đến những chiếc laptop chất lượng cao, chính hãng với mức giá hợp lý nhất cho mọi người dùng tại Việt Nam.
                </p>
                <p>
                  Với hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ, chúng tôi tự hào là đối tác tin cậy của các thương hiệu hàng đầu thế giới: Dell, HP, Lenovo, ASUS, Acer, Apple...
                </p>
                <p>
                  Đội ngũ chuyên viên luôn tận tâm, sẵn sàng tư vấn để bạn chọn được sản phẩm phù hợp nhất với nhu cầu và ngân sách.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition">
                <div className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-2">10+</div>
                <div className="text-lg font-semibold text-gray-800">Năm kinh nghiệm</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition">
                <div className="text-4xl md:text-5xl font-extrabold text-green-600 mb-2">50K+</div>
                <div className="text-lg font-semibold text-gray-800">Khách hàng hài lòng</div>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition">
                <div className="text-4xl md:text-5xl font-extrabold text-yellow-600 mb-2">100+</div>
                <div className="text-lg font-semibold text-gray-800">Mẫu sản phẩm</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-6 md:p-8 text-center shadow-lg hover:shadow-xl transition">
                <div className="text-4xl md:text-5xl font-extrabold text-red-600 mb-2">24/7</div>
                <div className="text-lg font-semibold text-gray-800">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của LapProVN
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Award className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Chất lượng
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Cam kết 100% sản phẩm chính hãng, bảo hành đầy đủ từ nhà sản xuất.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Tận tâm
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Đội ngũ tư vấn chuyên nghiệp, hỗ trợ khách hàng 24/7 với sự nhiệt tình cao nhất.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-yellow-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Target className="h-10 w-10 md:h-12 md:w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Uy tín
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Giá cả minh bạch, chính sách rõ ràng, không phát sinh chi phí ẩn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn LapProVN?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi không chỉ bán laptop, mà còn mang đến trải nghiệm tốt nhất cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Laptop className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Sản phẩm đa dạng
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Hơn 100 mẫu laptop từ các thương hiệu hàng đầu thế giới.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Award className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Bảo hành tốt
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Bảo hành chính hãng 12-24 tháng, hỗ trợ nhanh chóng.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-yellow-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Users className="h-10 w-10 md:h-12 md:w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Đội ngũ chuyên nghiệp
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Tư vấn viên giàu kinh nghiệm, luôn đặt khách hàng lên hàng đầu.
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-full mb-6 transition-transform group-hover:scale-110">
                <Headphones className="h-10 w-10 md:h-12 md:w-12 text-red-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                Hỗ trợ 24/7
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Luôn sẵn sàng giải đáp mọi thắc mắc của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-linear-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng tìm laptop phù hợp?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Khám phá ngay bộ sưu tập laptop đa dạng với ưu đãi đặc biệt dành riêng cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Xem tất cả sản phẩm
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border-2 border-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-700 transition shadow-lg"
            >
              Liên hệ tư vấn miễn phí
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}