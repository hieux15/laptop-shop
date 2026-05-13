'use client';

import { useCompare } from '@/app/context/CompareContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, BarChart2, Star, TrendingUp, Trash2, Plus, Shield, Cpu, MemoryStick, HardDrive, Monitor, Gamepad2, Battery } from 'lucide-react';

const SPEC_LABELS = {
  cpu: 'CPU',
  ram: 'RAM',
  storage: 'Lưu trữ',
  gpu: 'Card đồ họa',
  screen: 'Màn hình',
  battery: 'Pin',
};

const renderSpecIcon = (key) => {
  const iconProps = { className: "w-4 h-4 text-gray-500" };

  switch (key) {
    case 'cpu': return <Cpu {...iconProps} />;
    case 'ram': return <MemoryStick {...iconProps} />;
    case 'storage': return <HardDrive {...iconProps} />;
    case 'gpu': return <Gamepad2 {...iconProps} />;
    case 'screen': return <Monitor {...iconProps} />;
    case 'battery': return <Battery {...iconProps} />;
    default: return null;
  }
};

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, getCompareCount } = useCompare();
  const count = getCompareCount();

  const getSpecValue = (product, key) => {
    if (typeof product.specs === 'object' && product.specs !== null) {
      return product.specs[key] || '—';
    }
    return '—';
  };



  if (count === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center">
                <BarChart2 className="w-12 h-12 text-blue-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">So sánh sản phẩm</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Chọn tối đa 4 sản phẩm để so sánh chi tiết thông số kỹ thuật
            </p>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">So sánh chi tiết</h3>
                  <p className="text-sm text-gray-600">Đánh giá đầy đủ specs</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Tìm sản phẩm tốt nhất</h3>
                  <p className="text-sm text-gray-600">So sánh giá và chất lượng</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Quyết định thông minh</h3>
                  <p className="text-sm text-gray-600">Dựa trên dữ liệu thực tế</p>
                </div>
              </div>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <BarChart2 className="w-5 h-5" />
              Bắt đầu so sánh sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">So sánh sản phẩm</h1>
            <p className="text-gray-600">Đang so sánh {count} sản phẩm</p>
          </div>
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 mt-4 sm:mt-0"
          >
            <Trash2 size={16} />
            Xóa tất cả
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {compareList.map((product, index) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
              {/* Remove button */}
              <button
                onClick={() => removeFromCompare(product.id)}
                className="absolute z-10 top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              >
                <X size={16} />
              </button>

              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={150}
                    className="object-contain max-h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-blue-600 transition-colors mb-3">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-400 line-through">
                      {product.originalPrice.toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star
                          key={star}
                          size={12}
                          className={
                            star <= Math.round(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-gray-600 ml-1">
                      {Number(product.rating).toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Brand */}
                {product.brand && (
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.brand}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add more products placeholder */}
          {Array.from({ length: 4 - count }, (_, i) => (
            <div key={`placeholder-${i}`} className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 hover:border-blue-300 transition-colors duration-200">
              <Plus className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-gray-500 text-center text-sm">Thêm sản phẩm để so sánh</p>
              <Link
                href="/products"
                className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Chọn sản phẩm
              </Link>
            </div>
          ))}
        </div>

        {/* Specifications Comparison */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5" />
              Thông số kỹ thuật
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700 w-48">Thông số</th>
                  {compareList.map((product, index) => (
                    <th key={product.id} className="p-4 text-center font-semibold text-gray-700 min-w-50">
                      Sản phẩm {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(SPEC_LABELS).map(([key, label]) => (
                  <tr key={key} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-700 border-b border-gray-100 flex items-center gap-2">
                      {renderSpecIcon(key)}
                      {label}
                    </td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 text-center border-b border-gray-100 font-medium text-gray-800">
                        {getSpecValue(product, key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            Thêm sản phẩm khác
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="w-5 h-5" />
            Đến giỏ hàng
          </Link>
        </div>
      </div>
    </div>
  );
}