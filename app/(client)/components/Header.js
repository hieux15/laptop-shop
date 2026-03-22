"use client";

import Link from "next/link";
import { Laptop, ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useSession, signOut } from "next-auth/react";

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileName, setProfileName] = useState("");
  const { getTotalItems } = useCart();
  const { data: session, status } = useSession();
  const cartCount = getTotalItems();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const isAdmin = session?.user?.role === "ADMIN";

  const refreshProfileName = async () => {
    if (status !== "authenticated") return;
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) return;
      const user = await res.json();
      setProfileName(user.fullName || user.email || session.user?.name || "");
    } catch (err) {
      console.warn("Could not fetch profile", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      refreshProfileName();
    }

    const onProfileUpdated = () => refreshProfileName();
    window.addEventListener("profileUpdated", onProfileUpdated);

    return () => {
      window.removeEventListener("profileUpdated", onProfileUpdated);
    };
  }, [status, session?.user?.name]);

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
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </div>
          </NavItem>
          {status === "authenticated" ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition"
              >
                <User className="w-5 h-5" />
                <span>{profileName || session.user?.name || session.user?.email}</span>
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    aria-hidden
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    {!isAdmin && (
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Đơn hàng
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Tài khoản
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavItem href="/login">
              <User className="inline w-5 h-5 mr-1" />
              Đăng nhập
            </NavItem>
          )}
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
                <span className="mr-1">Giỏ hàng</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
            </NavItem>
            {status === "authenticated" ? (
              <>
                {!isAdmin && (
                  <Link href="/orders" onClick={closeMenu} className="text-gray-700 font-medium hover:text-blue-600">
                    Đơn hàng
                  </Link>
                )}
                <Link href="/profile" onClick={closeMenu} className="text-gray-700 font-medium hover:text-blue-600">
                  Tài khoản
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={closeMenu} className="text-gray-700 font-medium hover:text-blue-600">
                    Trang quản trị
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    signOut({ callbackUrl: "/" });
                  }}
                  className="text-left text-red-600 font-medium hover:text-red-700"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <NavItem href="/login" onClick={closeMenu}>
                <User className="inline w-5 h-5 mr-1" />
                Đăng nhập
              </NavItem>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
