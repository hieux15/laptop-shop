import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Laptop Pro VN - Cửa hàng laptop chính hãng, giá tốt",
  description: "Cửa hàng laptop chính hãng, giá tốt nhất thị trường.",
};

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
