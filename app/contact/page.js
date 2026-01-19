'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã liên hệ! Đây là phiên bản demo, chức năng gửi tin nhắn sẽ được triển khai ở giai đoạn sau.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop"
            alt="Contact Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-indigo-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-full mb-5 group-hover:scale-110 transition">
                <MapPin className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Địa chỉ
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                123 Đường ABC, Quận 1<br />
                TP. Hồ Chí Minh
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Phone className="h-10 w-10 md:h-12 md:w-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Điện thoại
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                Hotline: 0123 456 789<br />
                Tư vấn: 0987 654 321
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center hover:shadow-xl transition group">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-yellow-100 rounded-full mb-5 group-hover:scale-110 transition">
                <Mail className="h-10 w-10 md:h-12 md:w-12 text-yellow-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                Email
              </h3>
              <p className="text-base md:text-lg text-gray-600">
                info@laptopshop.vn<br />
                support@laptopshop.vn
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="0123456789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Tôi muốn hỏi về..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm md:text-base font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Gửi tin nhắn</span>
                </button>
              </form>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Thời gian làm việc
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 text-base md:text-lg">Thứ 2 - Thứ 6</p>
                      <p className="text-gray-600 text-base md:text-lg">8:00 - 18:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 text-base md:text-lg">Thứ 7</p>
                      <p className="text-gray-600 text-base md:text-lg">8:00 - 17:00</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900 text-base md:text-lg">Chủ nhật</p>
                      <p className="text-gray-600 text-base md:text-lg">9:00 - 16:00</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm md:text-base text-gray-700">
                    <strong className="text-green-900">Hỗ trợ khẩn cấp:</strong><br />
                    Hotline 24/7: 0123 456 789
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 md:p-8 text-white hover:shadow-xl transition">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Cần tư vấn ngay?
                </h3>
                <p className="text-base md:text-lg text-blue-100 mb-6 leading-relaxed">
                  Liên hệ hotline để được tư vấn miễn phí về sản phẩm phù hợp với nhu cầu của bạn
                </p>
                <a
                  href="tel:0123456789"
                  className="block w-full bg-white text-blue-700 px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors text-center shadow-lg"
                >
                  Gọi ngay: 0123 456 789
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}