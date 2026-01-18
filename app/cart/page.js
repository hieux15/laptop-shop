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
  Tag,
  X,
  House
} from 'lucide-react';
import { productsData } from '@/app/data/products';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  useEffect(() => {
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
    setIsLoaded(true);
  }, []);

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

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.1, name: 'Giảm 10%' });
      setPromoCode('');
    } else if (promoCode.toUpperCase() === 'FREESHIP') {
      setAppliedPromo({ code: 'FREESHIP', discount: 0, name: 'Miễn phí vận chuyển' });
      setPromoCode('');
    } else {
      alert('Mã giảm giá không hợp lệ!');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promoDiscount = appliedPromo?.discount ? subtotal * appliedPromo.discount : 0;
  const freeShipThreshold = 20000000;
  const shippingFee = 30000;
  const shipping = (appliedPromo?.code === 'FREESHIP' || subtotal >= freeShipThreshold) ? 0 : shippingFee;
  const total = subtotal - promoDiscount + shipping;

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
              <House size={16} /> 
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
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-xs sm:text-sm font-bold text-gray-500 uppercase">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-2 text-center">Đơn giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Thành tiền</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center hover:bg-gray-50 transition">
                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex items-start sm:items-center gap-3 sm:gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1 sm:p-2" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`} className="font-bold text-sm sm:text-base text-gray-900 hover:text-blue-600 transition line-clamp-2 mb-1">
                            {item.name}
                          </Link>
                          <p className="text-xs text-gray-500 capitalize mb-2">{item.brand}</p>
                          
                          {/* Mobile: Price and Quantity */}
                          <div className="md:hidden flex items-center justify-between gap-4 mb-2">
                            <span className="font-bold text-gray-900 text-sm">{item.price.toLocaleString('vi-VN')} ₫</span>
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-8 bg-white">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 hover:bg-gray-100 transition border-r border-gray-200 h-full"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-2 hover:bg-gray-100 transition border-l border-gray-200 h-full"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Mobile: Total Price */}
                          <div className="md:hidden flex items-center justify-between">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700 transition"
                            >
                              <Trash2 size={12} /> Xóa
                            </button>
                            <span className="font-bold text-blue-600 text-base">
                              {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                            </span>
                          </div>

                          {/* Desktop: Delete Button */}
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="hidden md:flex mt-2 text-xs sm:text-sm text-red-500 items-center gap-1 hover:text-red-700 transition"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </div>

                      {/* Desktop: Price */}
                      <div className="hidden md:block col-span-2 text-center">
                        <span className="font-bold text-gray-900 text-sm">{item.price.toLocaleString('vi-VN')} ₫</span>
                      </div>

                      {/* Desktop: Quantity */}
                      <div className="hidden md:flex col-span-2 justify-center">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-9 bg-white">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 hover:bg-gray-100 transition border-r border-gray-200 h-full"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 hover:bg-gray-100 transition border-l border-gray-200 h-full"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Desktop: Total */}
                      <div className="hidden md:block col-span-2 text-right">
                        <span className="font-bold text-blue-600 text-base sm:text-lg">
                          {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </span>
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
            <div className="lg:col-span-4 space-y-4">
              {/* Promo Code */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <p className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <Tag size={16} className="text-gray-600" />
                  Mã giảm giá
                </p>
                {appliedPromo ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-green-600" />
                      <div>
                        <p className="font-bold text-green-800 text-sm">{appliedPromo.code}</p>
                        <p className="text-xs text-green-600">{appliedPromo.name}</p>
                      </div>
                    </div>
                    <button onClick={removePromo} className="text-green-600 hover:text-green-800 transition">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Nhập mã..." 
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-800 transition"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Thử: SAVE10 hoặc FREESHIP</p>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-8">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-4 sm:mb-6 border-b border-gray-100 pb-3 sm:pb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Tạm tính</span>
                    <span className="font-medium">{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm sm:text-base text-green-600">
                      <span>Giảm giá</span>
                      <span className="font-medium">-{promoDiscount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}

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

                <button className="w-full bg-blue-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 mb-3 sm:mb-4 uppercase tracking-wide">
                  Tiến hành đặt hàng
                </button>
                
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