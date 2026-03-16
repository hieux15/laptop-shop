"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");
      if (!response.ok) throw new Error("Fetch profile failed");
      const json = await response.json();
      setUser(json);
      setFullName(json.fullName || "");
      setPhone(json.phone || "");
    } catch (error) {
      console.error(error);
      toast.error("Không lấy được thông tin tài khoản.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Họ tên không được để trống.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");
      setUser(data);
      toast.success("Cập nhật thông tin thành công.");
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Cập nhật thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Đang tải...</span>
      </div>
    );
  }

  if (!user) return null;

  const initials = (user.fullName || user.email || "U")
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4">

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-gray-900 truncate">{user.fullName || "—"}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-sm text-gray-500">{user.phone || "Chưa cập nhật SĐT"}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold mb-4">Hồ sơ tài khoản</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 text-white font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition"
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/profile/change-password")}
              className="w-full py-3 text-blue-600 font-bold border border-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}