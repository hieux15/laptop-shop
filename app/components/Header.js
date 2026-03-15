"use client";

import Link from "next/link";
import { Laptop, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/products", label: "Sản phẩm" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/contact", label: "Liên hệ" },
];

function NavItem({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-700 font-medium hover:text-blue-600 transition"
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Laptop className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="text-gray-800">Lap</span>
            <span className="text-yellow-400">Pro</span>
            <span className="text-blue-500">VN</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <NavItem key={link.href} href={link.href}>
              {link.label}
            </NavItem>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <NavItem href="/cart">
            <div className="relative inline-flex items-center">
              <ShoppingCart className="inline w-5 h-5 mr-1" />
              <span className="mr-1">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
          </NavItem>
          <NavItem href="/login">
            <User className="inline w-5 h-5 mr-1" />
            Đăng nhập
          </NavItem>
        </div>

        <button onClick={toggleMenu} className="md:hidden">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex flex-col p-4 gap-2">
            {NAV_LINKS.map(link => (
              <NavItem
                key={link.href}
                href={link.href}
                onClick={closeMenu}
              >
                {link.label}
              </NavItem>
            ))}
            <div className="border-t border-gray-200 my-2"></div>
            <NavItem href="/cart" onClick={closeMenu}>
              <div className="relative inline-flex items-center">
                <ShoppingCart className="inline w-5 h-5 mr-1" />
                <span className="mr-1">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
            </NavItem>
            <NavItem href="/login" onClick={closeMenu}>
              <User className="inline w-5 h-5 mr-1" />
              Đăng nhập
            </NavItem>
          </div>
        </div>
      )}
    </header>
  );
}
