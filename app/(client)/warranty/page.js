'use client';

import { Shield, Clock, CheckCircle, XCircle, FileText, Award, Phone, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function WarrantyPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop"
            alt="Warranty Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-indigo-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Chính sách bảo hành
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Cam kết bảo hành chính hãng, hỗ trợ tận tâm
          </p>
        </div>
      </section>

      {/* Warranty Period */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thời hạn bảo hành
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tất cả sản phẩm laptop tại LapProVN đều được bảo hành chính hãng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Standard */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Shield className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Bảo hành phần cứng
              </h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">12 - 24 tháng</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mainboard, CPU, RAM</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ổ cứng, màn hình</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Bàn phím, touchpad</span>
                </li>
              </ul>
            </div>

            {/* Battery */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Clock className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Bảo hành pin
              </h3>
              <p className="text-3xl font-bold text-green-600 mb-4">6 - 12 tháng</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pin chai trên 30%</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pin phồng, chai pin</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sạc không vào</span>
                </li>
              </ul>
            </div>

            {/* Software */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-purple-100 rounded-full mb-5 group-hover:scale-110 transition">
                <FileText className="h-10 w-10 md:h-12 md:w-12 text-purple-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Bảo hành phần mềm
              </h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">3 tháng</p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cài đặt Windows</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Driver phần cứng</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Phần mềm văn phòng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty Conditions */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Covered */}
            <div className="bg-green-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Điều kiện bảo hành</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Còn trong thời hạn bảo hành</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Có hóa đơn mua hàng hợp lệ</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tem bảo hành còn nguyên vẹn</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Lỗi do nhà sản xuất</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Chưa qua sửa chữa bên thứ ba</span>
                </li>
              </ul>
            </div>

            {/* Not Covered */}
            <div className="bg-red-50 rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Không được bảo hành</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hư hỏng do va đập, rơi vỡ</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Ngấm nước, ẩm ướt</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tự ý tháo lắp, sửa chữa</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Cài đặt phần mềm độc hại</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hao mòn tự nhiên (pin chai...)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Extended Warranty */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Gói bảo hành mở rộng
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Tăng thời hạn bảo hành và nhận thêm nhiều ưu đãi hấp dẫn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Silver */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Gói Bạc</h3>
              <p className="text-3xl font-bold text-gray-600 mb-4">+500.000đ</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Gia hạn 12 tháng</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Bảo hành rơi vỡ</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Hỗ trợ 24/7</span>
                </li>
              </ul>
            </div>

            {/* Gold - Featured */}
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8 text-center text-white hover:shadow-xl transition relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
                Phổ biến nhất
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">Gói Vàng ⭐</h3>
              <p className="text-3xl font-bold mb-4">+1.000.000đ</p>
              <ul className="text-sm text-blue-100 space-y-2 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span>Gia hạn 24 tháng</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span>Bảo hành rơi vỡ + nước</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  <span>Thay pin miễn phí 1 lần</span>
                </li>
              </ul>
            </div>

            {/* Diamond */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Gói Kim Cương</h3>
              <p className="text-3xl font-bold text-purple-600 mb-4">+2.000.000đ</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Gia hạn 36 tháng</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Bảo hành toàn diện</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Thay thế miễn phí</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 md:p-12 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Liên hệ bảo hành</h3>
              <p className="text-lg text-blue-100">
                Đội ngũ bảo hành luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-100">Hotline</p>
                  <p className="font-bold text-lg"> 0123 456 789</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-blue-100">Email</p>
                  <p className="font-bold text-lg">warranty@laptoprovn.com</p>
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