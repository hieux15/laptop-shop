'use client';

import { RotateCcw, Clock, CheckCircle, XCircle, CreditCard, ArrowLeftRight, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function RefundPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
            alt="Refund Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-indigo-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Chính sách hoàn trả
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Quy định hoàn trả sản phẩm tại LapProVN
          </p>
        </div>
      </section>

      {/* Return Policies */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thời hạn hoàn trả
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chúng tôi hỗ trợ hoàn trả trong thời gian quy định
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Free Exchange */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-5 group-hover:scale-110 transition">
                <RotateCcw className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Đổi trả miễn phí
              </h3>
              <p className="text-3xl font-bold text-green-600 mb-4">7 ngày</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sản phẩm lỗi/giao sai</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Miễn phí vận chuyển 2 chiều</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Đổi sản phẩm tương đương</span>
                </li>
              </ul>
            </div>

            {/* Refund */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full mb-5 group-hover:scale-110 transition">
                <CreditCard className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Hoàn tiền
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">15 ngày</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Hoàn tiền qua tài khoản NH</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Phí ship do KH chịu</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Xử lý 3-5 ngày làm việc</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Eligible */}
            <div className="bg-green-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Điều kiện hoàn trả</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Sản phẩm lỗi kỹ thuật do NSX</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Giao sai sản phẩm</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hư hỏng khi vận chuyển</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Không đúng với mô tả</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Còn nguyên seal, chưa sử dụng</span>
                </li>
              </ul>
            </div>

            {/* Not Eligible */}
            <div className="bg-red-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Không được hoàn trả</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Đã qua sử dụng/cài đặt</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hư hỏng do người dùng</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Không có hóa đơn hợp lệ</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tem/seal đã bị rách</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hết thời hạn hoàn trả</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Options */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phương thức hoàn tiền
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nhiều hình thức hoàn tiền linh hoạt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Bank Transfer */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full mb-5 group-hover:scale-110 transition">
                <CreditCard className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Chuyển khoản
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">3-5 ngày</p>
              <p className="text-sm text-gray-500">Áp dụng cho mọi đơn hàng</p>
            </div>

            {/* VNPay */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-purple-100 rounded-full mb-5 group-hover:scale-110 transition">
                <ArrowLeftRight className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                VNPay
              </h3>
              <p className="text-2xl font-bold text-purple-600 mb-4">1-3 ngày</p>
              <p className="text-sm text-gray-500">Hoàn về ví VNPay</p>
            </div>

            {/* E-Wallet */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-5 group-hover:scale-110 transition">
                <RotateCcw className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Ví điện tử
              </h3>
              <p className="text-2xl font-bold text-green-600 mb-4">1-2 ngày</p>
              <p className="text-sm text-gray-500">MoMo, ZaloPay</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Policy */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full shrink-0">
                <ArrowLeftRight className="h-12 w-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Chính sách đổi sản phẩm</h3>
                <p className="text-lg text-blue-100 mb-6">
                  Ngoài hoàn tiền, bạn có thể chọn đổi sang sản phẩm khác
                </p>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Đổi cùng sản phẩm (khác màu/cấu hình)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Đổi sang SP khác (giá tương đương)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>SP mới giá cao hơn → bù chênh lệch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>SP mới giá thấp hơn → hoàn chênh lệch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Liên hệ hoàn trả</h3>
              <p className="text-lg text-blue-100">
                Đội ngũ hỗ trợ hoàn trả luôn sẵn sàng phục vụ bạn
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-100">Hotline</p>
                  <p className="font-bold text-lg">0123 456 789</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-100">Email</p>
                  <p className="font-bold text-lg">refund@laptoprovn.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-100">Địa chỉ</p>
                  <p className="font-bold text-lg">123 Đường ABC, Quận 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}