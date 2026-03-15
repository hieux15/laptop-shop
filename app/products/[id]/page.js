'use client';

import { useState, use ,useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ShoppingCart, Heart, Share2, Shield, Truck, CreditCard, Check, Minus, Plus, House } from 'lucide-react';
import { productsData } from '@/app/data/products';
import { ProductCard } from '@/app/components/ProductCard';
import { ProductDetailSkeleton } from '@/app/components/Skeleton';
import { useCart } from '@/app/context/CartContext.js'; 

export default function ProductDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const foundProduct = productsData.find(p => p.id === parseInt(params.id));
    setProduct(foundProduct);
    setIsLoaded(true);
  }, [params.id]);
  
  if (!isLoaded) {
    return <ProductDetailSkeleton />;
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link href="/" className="text-blue-600 hover:underline">Quay lại trang chủ</Link>
      </div>
    );
  }

  const relatedProducts = productsData
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 overflow-x-auto">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors whitespace-nowrap">
              <House size={16} /> 
              <span className="truncate">Trang chủ</span>
            </Link>
            <ChevronRight size={14} className="mx-1 sm:mx-2 shrink-0" />
            <Link href="/products" className="hover:text-blue-600 transition whitespace-nowrap">Sản phẩm</Link>
            <ChevronRight size={14} className="mx-1 sm:mx-2 shrink-0" />
            <span className="text-gray-900 font-medium truncate max-w-30 sm:max-w-none">{product.name}</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
              <div className="relative aspect-square sm:aspect-4/3 rounded-lg sm:rounded-xl overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-2 sm:p-4"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
                />
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="bg-blue-50 p-1.5 sm:p-2 rounded-lg text-blue-600 shrink-0">
                  <Shield size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">Bảo hành</p>
                  <p className="text-xs sm:text-sm font-medium truncate">12 tháng</p>
                </div>
              </div>
              <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="bg-green-50 p-1.5 sm:p-2 rounded-lg text-green-600 shrink-0">
                  <Truck size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">Giao hàng</p>
                  <p className="text-xs sm:text-sm font-medium truncate">Miễn phí</p>
                </div>
              </div>
              <div className="bg-white p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
                <div className="bg-purple-50 p-1.5 sm:p-2 rounded-lg text-purple-600 shrink-0">
                  <CreditCard size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-bold">Trả góp</p>
                  <p className="text-xs sm:text-sm font-medium truncate">0% lãi suất</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  {product.brand}
                </span>
                <div className="flex gap-1 sm:gap-2">
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition text-gray-500" title="Chia sẻ">
                    <Share2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <button className="p-1.5 sm:p-2 hover:bg-red-50 rounded-full transition text-gray-500 hover:text-red-500" title="Yêu thích">
                    <Heart size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-6 sm:mb-8">
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </span>
                  {product.originalPrice && (
                    <span className="text-base sm:text-lg text-gray-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')} ₫
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs sm:text-sm font-bold">
                      -{discount}%
                    </span>
                  )}
                </div>
               {product.originalPrice && product.originalPrice > product.price && (
                  <p className="text-xs sm:text-sm text-green-600 flex items-center gap-1 font-medium">
                    <Check size={14} className="sm:w-4 sm:h-4" /> Tiết kiệm {((product.originalPrice - product.price)).toLocaleString('vi-VN')} ₫
                  </p>
                )}
              </div>

              {/* thông số kỹ thuật */}
              <div className="mb-6 sm:mb-8">
                <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 border-l-4 border-blue-600 pl-2 sm:pl-3 text-sm sm:text-base">Thông số kỹ thuật</h3>
                <div className="space-y-2 sm:space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2 gap-2">
                      <span className="text-xs sm:text-sm text-gray-500 capitalize shrink-0">
                        {key.replace('graphics', 'Đồ họa').replace('battery', 'Pin').replace('display', 'Màn hình').replace('storage', 'Ổ cứng')}
                      </span>
                      <span className="font-medium text-gray-900 text-right text-xs sm:text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* thêm vào giỏ hàng */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg sm:rounded-xl overflow-hidden h-10 sm:h-12">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 hover:bg-gray-100 transition h-full"
                    >
                      <Minus size={16} className="sm:w-4.5 sm:h-4.5" />
                    </button>
                    <span className="w-10 sm:w-12 text-center font-bold text-base sm:text-lg">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 sm:px-4 hover:bg-gray-100 transition h-full"
                    >
                      <Plus size={16} className="sm:w-4.5 sm:h-4.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, quantity)} 
                    className="flex-1 bg-white border-2 border-blue-600 text-blue-600 h-10 sm:h-12 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:bg-blue-50 transition flex items-center justify-center gap-1 sm:gap-2">
                    <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                    <span className="xs:inline">Thêm vào giỏ</span>
                  </button>
                </div>
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="w-full bg-blue-600 text-white h-12 sm:h-14 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 transition uppercase tracking-wide">
                  MUA NGAY
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* mô tả sản phẩm */}
        <div className="mt-8 sm:mt-12 bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mô tả sản phẩm</h2>
          <div className="prose prose-sm sm:prose-blue max-w-none text-gray-600">
            <p className="leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              {product.description}
            </p>
            <p className="leading-relaxed text-sm sm:text-base">
              Sản phẩm được phân phối chính hãng tại hệ thống LapProVN, cam kết mới 100%, bảo hành chính hãng theo tiêu chuẩn của nhà sản xuất. Với cấu hình mạnh mẽ {product.specs.cpu}, {product.specs.ram} RAM và ổ cứng {product.specs.storage}, đây là lựa chọn tuyệt vời cho nhu cầu sử dụng của bạn.
            </p>
          </div>
        </div>

        {/* sản phẩm tương tự */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold">Sản phẩm tương tự</h2>
              <Link href="/products" className="text-blue-600 font-bold flex items-center hover:underline text-sm sm:text-base">
                <span className="hidden xs:inline">Xem tất cả</span>
                <span className="xs:hidden">Xem thêm</span>
                <ChevronRight size={16} className="sm:w-4.5 sm:h-4.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}