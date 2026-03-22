"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

export function ProductCard({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative h-52 bg-white flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={200}
            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500"
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
            <>{product.specs.cpu} • {product.specs.ram} • {product.specs.storage}</>
          ) : (
            product.specs
          )}
        </p>

        {/* Rating */}
        <div className="mb-3">
          {product.reviewCount > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={13}
                    className={
                      star <= Math.round(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {Number(product.rating).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviewCount})
              </span>
            </div>
          ) : null}
        </div>

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

          {/* Stock badge */}
          {product.stock !== null && (
            <div className="mb-3">
              {product.stock === 0 ? (
                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                  Hết hàng
                </span>
              ) : product.stock <= 5 ? (
                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                  Chỉ còn {product.stock} sản phẩm
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Button */}
        <Link
          href={product.stock === 0 ? 'javascript:void(0)' : `/products/${product.id}`}
          className={`w-full py-2.5 rounded-lg font-semibold transition-colors duration-200 text-center block ${
            product.stock === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {product.stock === 0 ? 'Hết hàng' : 'Xem chi tiết'}
        </Link>
      </div>
    </div>
  );
}