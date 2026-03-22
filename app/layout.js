import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import SessionProvider from "./(client)/components/SessionProvider";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Laptop Pro VN - Cửa hàng laptop chính hãng, giá tốt",
  description: "Cửa hàng laptop chính hãng, giá tốt nhất thị trường.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
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
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}