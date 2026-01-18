import Link from "next/link";
import Image from "next/image";

export function ProductCard({ product }) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
      <Link href={`/products/${product.id}`}>
      <div className="relative h-56">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{discount}%
          </span>
        )}
      </div>
      </Link>
      
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3">
          {typeof product.specs === 'object' ? (
            <>
              {product.specs.cpu} | {product.specs.ram} | {product.specs.storage}
            </>
          ) : (
            product.specs
          )}
        </p>
    
        <div className="mb-4">
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {product.originalPrice.toLocaleString('vi-VN')} ₫
            </p>
          )}
          <p className="text-2xl font-bold text-blue-600">
            {product.price.toLocaleString('vi-VN')} ₫
          </p>
        </div>
        
        <Link
          href={`/products/${product.id}`}
          className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
