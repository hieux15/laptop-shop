'use client';

import { CreditCard, Building2, Smartphone, Calendar, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
            alt="Payment Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-indigo-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Chính sách thanh toán
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Các phương thức thanh toán an toàn và tiện lợi tại LapProVN
          </p>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phương thức thanh toán
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi hỗ trợ nhiều hình thức thanh toán đa dạng để bạn lựa chọn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* COD */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full mb-5 group-hover:scale-110 transition">
                <CreditCard className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Thanh toán khi nhận hàng
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                Thanh toán bằng tiền mặt khi nhận hàng tại nhà
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Áp dụng cho đơn dưới 50 triệu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Kiểm tra hàng trước khi trả</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Không phát sinh phí</span>
                </li>
              </ul>
            </div>

            {/* Bank Transfer */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Building2 className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Chuyển khoản ngân hàng
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                Chuyển khoản trực tiếp đến tài khoản
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Vietcombank: 1234567890</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Nội dung: [Mã đơn] - [Tên]</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Xử lý sau khi xác nhận</span>
                </li>
              </ul>
            </div>

            {/* VNPay */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-purple-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Smartphone className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Thanh toán VNPay
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                Thanh toán trực tuyến qua cổng VNPay
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Hỗ trợ tất cả ngân hàng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Thanh toán qua QR Code</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Xác nhận tức thì</span>
                </li>
              </ul>
            </div>

            {/* Installment */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-orange-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Calendar className="h-10 w-10 md:h-12 md:w-12 text-orange-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Trả góp 0% lãi suất
              </h3>
              <p className="text-base md:text-lg text-gray-600 mb-4">
                Trả góp qua thẻ tín dụng từ 3 triệu
              </p>
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Kỳ hạn: 3, 6, 9, 12 tháng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Lãi suất 0% (một số NH)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Visa, Mastercard, JCB</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full shrink-0">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Cam kết bảo mật thanh toán</h3>
                <p className="text-lg text-blue-100 mb-6">
                  Thông tin thanh toán của bạn được bảo vệ tuyệt đối với các tiêu chuẩn bảo mật cao nhất
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Mã hóa SSL 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Không lưu thông tin thẻ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Chuẩn bảo mật PCI DSS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Xác thực 2 lớp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}