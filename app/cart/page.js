'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowLeft, 
  ChevronRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Home
} from 'lucide-react';
import { productsData } from '@/app/data/products';


export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load từ localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        // Mặc định có 2 sản phẩm nếu giỏ trống
        const initialItems = [
          {
            ...productsData[0],
            quantity: 1,
          },
          {
            ...productsData[1],
            quantity: 1,
          },
        ];
        setCartItems(initialItems);
        localStorage.setItem('cart', JSON.stringify(initialItems));
      }
    } catch (error) {
      console.error('Lỗi load giỏ hàng:', error);
    }
    setIsLoaded(true);
  }, []);

  // Lưu vào localStorage khi cartItems thay đổi
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Lỗi lưu giỏ hàng:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShipThreshold = 20000000;
  const shippingFee = 30000;
  const shipping = subtotal >= freeShipThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 sm:pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 mb-6 sm:mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
             <Link href="/" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors whitespace-nowrap">
              <Home size={16} /> 
              <span className="truncate">Trang chủ</span>
            </Link>
            <ChevronRight size={14} className="mx-1 sm:mx-2 shrink-0" />
            <span className="text-gray-900 font-medium">Giỏ hàng</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 flex flex-wrap items-center gap-2 sm:gap-3">
          <span>Giỏ hàng</span>
          <span className="text-sm sm:text-lg font-normal text-gray-500">({cartItems.length})</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <div className="bg-blue-50 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-blue-600">
              <ShoppingBag size={32} className="sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Giỏ hàng trống</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">Hiện tại bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" /> Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start">
            {/* List Items */}
            <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header: Đã chia lại tỷ lệ cột */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs sm:text-sm font-bold text-gray-500 uppercase">
                  <div className="col-span-4">Sản phẩm</div>
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-3 text-right">Thành tiền</div>
                  <div className="col-span-1 text-center">Thao tác</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center hover:bg-gray-50 transition">
                      <div className="col-span-1 md:col-span-4 flex items-start sm:items-center gap-3 sm:gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1 sm:p-2" sizes="(max-width: 768px) 10vw, 5vw" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`} className="font-bold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-1">
                            {item.name}
                          </Link>
                          <p className="text-xs text-gray-500 capitalize">{item.brand}</p>
                          
                          {/* Mobile: Price and Quantity */}
                          <div className="md:hidden flex items-center justify-between gap-4 mt-2 mb-2">
                            <span className="font-bold text-gray-900 text-sm">{item.price.toLocaleString('vi-VN')} ₫</span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-white">
                              <button onClick={() => updateQuantity(item.id, -1)} className="px-2 hover:bg-gray-100 transition border-r border-gray-200 h-full">
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="px-2 hover:bg-gray-100 transition border-l border-gray-200 h-full">
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Mobile: Bottom Actions */}
                          <div className="md:hidden flex items-center justify-between mt-2">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 -ml-2 text-gray-400 hover:text-red-500 transition"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 size={18} />
                            </button>
                            <span className="font-bold text-blue-600 text-base">
                              {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop: Price */}
                      <div className="hidden md:block col-span-2 text-center">
                        <span className="font-bold text-gray-900 text-sm">{item.price.toLocaleString('vi-VN')} ₫</span>
                      </div>

                      {/* Desktop: Quantity */}
                      <div className="hidden md:flex col-span-2 justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-3 hover:bg-gray-100 transition border-r border-gray-200 h-full">
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-3 hover:bg-gray-100 transition border-l border-gray-200 h-full">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Desktop: Total */}
                      <div className="hidden md:block col-span-3 text-right">
                        <span className="font-bold text-blue-600 text-base sm:text-lg">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </span>
                      </div>

                      {/* Desktop: Delete Button (Cột Thao tác mới) */}
                      <div className="hidden md:flex col-span-1 justify-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                          title="Xóa khỏi giỏ hàng"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
              {/* Service Policy */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <Truck className="text-blue-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">Miễn phí vận chuyển</p>
                    <p className="text-xs text-gray-500">Cho đơn từ 20Tr</p>
                  </div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <ShieldCheck className="text-green-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">100% Chính hãng</p>
                    <p className="text-xs text-gray-500">Bảo hành 12-24 tháng</p>
                  </div>
                </div>
                <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                  <CreditCard className="text-purple-600 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase">Thanh toán an toàn</p>
                    <p className="text-xs text-gray-500">Đa dạng phương thức</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-8">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium">{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>

                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-medium">{shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')} ₫`}</span>
                  </div>

                  {shipping > 0 && subtotal < freeShipThreshold && (
                    <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 font-medium">
                      Mua thêm <b>{(freeShipThreshold - subtotal).toLocaleString('vi-VN')} ₫</b> để được miễn phí vận chuyển
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6 sm:mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Tổng cộng</span>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-extrabold text-blue-600">{total.toLocaleString('vi-VN')} ₫</p>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/checkout" 
                  className="w-full inline-flex items-center justify-center bg-blue-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 mb-3 sm:mb-4 uppercase tracking-wide"
                >
                  Tiến hành đặt hàng
                </Link>
                
                <Link 
                  href="/products" 
                  className="w-full inline-flex items-center justify-center gap-2 text-gray-500 font-bold py-2 hover:text-blue-600 transition text-xs sm:text-sm"
                >
                  <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}