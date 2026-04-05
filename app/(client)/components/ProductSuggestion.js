import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function ProductSuggestion({ product }) {
  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="relative w-16 h-16 shrink-0">
          <Image
            src={product.image || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm text-gray-900 truncate">
            {product.name}
          </h4>
          <p className="text-red-600 font-semibold text-sm">
            {formatPrice(product.price)} VND
          </p>
          <p className="text-xs text-gray-500 mt-1">{product.reason}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <Link
          href={`/products/${product.id}`}
          className="flex-1 text-center text-xs bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 transition-colors"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
