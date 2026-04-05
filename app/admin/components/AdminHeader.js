"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Search } from "lucide-react";

export default function AdminHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const user = await res.json();
          setProfileName(user.fullName || user.email || session?.user?.name || "");
        }
      } catch (err) {
        console.warn("Could not fetch profile", err);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      {/* Search Bar - Simple */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-700 line-clamp-1">
              {profileName || session?.user?.name || session?.user?.email || "Admin"}
            </p>
            <p className="text-xs text-gray-500">Quản trị viên</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 hidden md:block" />
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-50 py-1">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {profileName || session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {session?.user?.email || ""}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push("/admin/profile");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={16} />
                Thông tin cá nhân
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  router.push("/");
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogOut size={16} className="rotate-180" />
                Về cửa hàng
              </button>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}