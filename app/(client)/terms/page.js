'use client';

import { FileText, CreditCard, Truck, RefreshCw, Shield, Scale } from 'lucide-react';
import Image from 'next/image';

const sections = [
  {
    title: 'Điều khoản mua hàng',
    description: 'Khách hàng phải từ đủ 18 tuổi trở lên mới có thể thực hiện giao dịch trên website. Vui lòng cung cấp thông tin chính xác, trung thực khi đặt hàng. LapProVN có quyền từ chối hoặc hủy đơn hàng nếu phát hiện thông tin sai lệch, giả mạo hoặc có dấu hiệu gian lận.',
    icon: FileText,
    bgClass: 'bg-white',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Phương thức thanh toán',
    description: 'Chúng tôi hỗ trợ nhiều hình thức thanh toán linh hoạt: thanh toán khi nhận hàng (COD) cho đơn dưới 50 triệu đồng, chuyển khoản ngân hàng qua các tài khoản doanh nghiệp, thanh toán trực tuyến qua cổng VNPay và các phương thức trả góp 0% lãi suất với nhiều đối tác tài chính.',
    icon: CreditCard,
    bgClass: 'bg-gray-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Giao hàng',
    description: 'Chúng tôi giao hàng toàn quốc với phí vận chuyển được tính theo khu vực và trọng lượng sản phẩm. Miễn phí giao hàng cho đơn hàng từ 10 triệu đồng trở lên. Quý khách vui lòng kiểm tra tình trạng hàng hóa trước khi nhận và ký xác nhận với nhân viên giao hàng.',
    icon: Truck,
    bgClass: 'bg-white',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    title: 'Đổi trả hàng',
    description: 'Khách hàng được đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu phát hiện lỗi lỗi từ nhà sản xuất. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng và kèm theo hóa đơn mua hàng bản gốc. Marque không chịu trách nhiệm đổi trả với các lỗi do người dùng gây ra.',
    icon: RefreshCw,
    bgClass: 'bg-gray-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Bảo hành',
    description: 'Tất cả sản phẩm đều được bảo hành theo chính sách của nhà sản xuất. LapProVN hỗ trợ quy trình bảo hành chính hãng cho khách hàng. Thời gian bảo hành thay đổi tùy theo từng sản phẩm và hãng sản xuất, vui lòng tham khảo thông tin bảo hành trên từng trang sản phẩm.',
    icon: Shield,
    bgClass: 'bg-white',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    title: 'Trách nhiệm',
    description: 'LapProVN không chịu trách nhiệm về các thiệt hại gián tiếp hoặc hậu quả phát sinh từ việc sử dụng sản phẩm không theo hướng dẫn. Giá sản phẩm có thể thay đổi tùy thời điểm mà không cần thông báo trước. Chúng tôi có thể thay đổi các điều khoản dịch vụ bất cứ lúc nào với thông báo công khai trên website.',
    icon: Scale,
    bgClass: 'bg-gray-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
];

export default function TermsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop"
            alt="Terms Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-indigo-900/90 to-blue-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Điều khoản dịch vụ
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Các điều khoản và điều kiện giao dịch tại LapProVN
          </p>
        </div>
      </section>

      {/* Sections */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Điều khoản & Điều kiện
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Vui lòng đọc kỹ các điều khoản dịch vụ trước khi thực hiện giao dịch
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className={`${section.bgClass} rounded-2xl shadow-lg p-6 md:p-8`}
                >
                  <div className="flex items-start gap-5">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${section.iconBg} rounded-full shrink-0`}>
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <p className="text-base md:text-lg text-gray-500 leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
