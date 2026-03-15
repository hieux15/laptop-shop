"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

export function ProductCard({ product }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const { addToCart, isInCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    
    setAdding(true);
    addToCart(product, 1);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      {/* Image Container */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex gap-2">
            {product.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-base mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {typeof product.specs === 'object' ? (
            <>
              {product.specs.cpu} • {product.specs.ram} • {product.specs.storage}
            </>
          ) : (
            product.specs
          )}
        </p>

        {/* Price */}
        <div className="mt-auto mb-4">
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-blue-600">
              {product.price.toLocaleString('vi-VN')} ₫
            </p>
            {product.originalPrice && (
              <p className="text-xs text-gray-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Link 
            href={`/products/${product.id}`}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 active:scale-95 text-center"
          >
            Xem chi tiết
          </Link>
          <button 
            onClick={handleAddToCart}
            disabled={adding}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-lg transition-colors duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
