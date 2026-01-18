'use client';

import Link from 'next/link';
import { Laptop, Facebook, Youtube, MessageCircle, Send, CreditCard, Smartphone } from 'lucide-react';

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Sản phẩm', href: '/products' },
  { name: 'Giới thiệu', href: '/about' },
  { name: 'Liên hệ', href: '/contact' },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/LapProVN', label: 'Facebook' },
  { icon: Youtube, href: 'https://www.youtube.com/@FPTShop_', label: 'YouTube' },
  { icon: MessageCircle, href: 'https://zalo.me/0123456789', label: 'Zalo' },
  { icon: Send, href: 'https://t.me/LapProVN', label: 'Telegram' },
];

const privacyLinks = [
  { name: 'Chính sách thanh toán', href: '/privacy' },
  { name: 'Điều khoản dịch vụ', href: '/terms' },
  { name: 'Chính sách bảo hành', href: '/warranty' },
  { name: 'Chính sách hoàn trả', href: '/refund' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">

          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-500 p-3.5 rounded-lg">
                <Laptop className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-white">Lap</span>
                <span className="text-2xl font-bold text-yellow-400">Pro</span>
                <span className="text-xl font-semibold text-blue-500">VN</span>
              </div>
            </Link>
            <p className="text-sm md:text-base leading-relaxed">
              Cửa hàng laptop chính hãng, giá tốt nhất thị trường. 
              Cam kết chất lượng và dịch vụ hậu mãi tận tâm.
            </p>
            <h3 className="text-xl font-semibold text-white mt-6 mb-4">Kết nối với chúng tôi</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-7 w-7" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-5">Liên kết nhanh</h3>
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="font-medium hover:text-blue-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-5">Chính sách</h3>
            <ul className="space-y-3">
              {privacyLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="font-medium hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-5">Đăng ký nhận tin</h3>
            <p className="text-sm md:text-base mb-4 leading-relaxed">Nhận khuyến mãi và ưu đãi mới nhất.</p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="font-medium">&copy; {new Date().getFullYear()} LapProVN. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <CreditCard className="h-7 w-7 text-gray-500 hover:text-gray-400 transition-colors" />
            <Smartphone className="h-7 w-7 text-gray-500 hover:text-gray-400 transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}