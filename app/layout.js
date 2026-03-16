import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "react-hot-toast";
import SessionProvider from "./components/SessionProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Laptop Pro VN - Cửa hàng laptop chính hãng, giá tốt",
  description: "Cửa hàng laptop chính hãng, giá tốt nhất thị trường.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          <SessionProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: '#1e3a8a',
                color: '#fff',
                borderRadius: '12px',
                padding: '14px 18px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
            }}
          />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="grow">
              {children}
            </main>
            <Footer />
          </div>
          </SessionProvider>
        </CartProvider>
      </body>
    </html>
  );
}