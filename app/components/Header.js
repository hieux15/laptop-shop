"use client";
import Link from "next/link";
import { Laptop, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-500 p-3.5 rounded-lg">
                <Laptop className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-800">Lap</span>
                <span className="text-2xl font-bold text-yellow-400">Pro</span>
                <span className="text-xl font-semibold text-blue-500">VN</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              Trang chủ
            </Link>
            <Link href="/about" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              Giới thiệu
            </Link>
            <Link href="/products" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              Sản phẩm
            </Link>
            <Link href="/contact" className="text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              Liên hệ
            </Link>
          </nav>

           <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="flex items-center space-x-1 text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              <ShoppingCart className="h-6 w-6" />
              <span>Giỏ hàng</span>
            </Link>
            <Link href="/login" className="flex items-center space-x-1 text-gray-700 font-medium hover:text-blue-600 transition duration-300">
              <User className="h-6 w-6" />
              <span>Đăng nhập</span>
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col space-y-4 px-4 py-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                Trang chủ
              </Link>
              <Link href="/about" className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                Giới thiệu
              </Link>
              <Link href="/products" className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                Sản phẩm
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                Liên hệ
              </Link>
            </nav>
            <div className="border-t border-gray-200 pt-4">
              <Link href="/cart" className="flex items-center space-x-2 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                 <ShoppingCart className="h-6 w-6" />
                 <span>Giỏ hàng</span>
              </Link>
              <Link href="/login" className="flex items-center space-x-2 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition">
                <User className="h-6 w-6" />
                <span>Đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}