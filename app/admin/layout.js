import { Inter } from "next/font/google";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Admin Dashboard | LapProVN",
  description: "Trang quản trị hệ thống LapProVN",
};

export default function AdminLayout({ children }) {
  return (
    <div className={`${inter.className} antialiased min-h-screen bg-gray-100`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}