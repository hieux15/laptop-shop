import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google"; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Laptop Shop",
  description: "Cửa hàng laptop chính hãng, giá tốt nhất thị trường.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="grow">
            {children}
          </main>
          <Footer />
        </div>
        
      </body>
    </html>
  );
}