'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, X, Search } from 'lucide-react';
import { productsData, categories, brands, priceRanges } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

function ProductsPageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=2070&auto=format&fit=crop"
            alt="Products Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-indigo-900/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Sản phẩm của chúng tôi
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Khám phá bộ sưu tập laptop đa dạng từ các thương hiệu hàng đầu
          </p>
        </div>
      </section>
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 animate-pulse">
                <div className="h-6 w-24 bg-gray-200 rounded mb-6" />
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded" />
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded" />
                  ))}
                </div>
              </div>
            </aside>
            <div className="flex-1">
              <div className="h-12 bg-gray-200 rounded-lg mb-6 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(productsData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load products from default data
    setProducts(productsData);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  let filteredProducts = products.filter(product => {
    const searchMatch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs.cpu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs.storage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs.graphics?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
    const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand;
    
    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    const priceMatch = !priceRange || 
      (product.price >= priceRange.min && product.price <= priceRange.max);
    
    return searchMatch && categoryMatch && brandMatch && priceMatch;
  });

  const getSortComparator = () => {
    if (sortBy === 'price-asc') return (a, b) => a.price - b.price;
    if (sortBy === 'price-desc') return (a, b) => b.price - a.price;
    if (sortBy === 'rating') return (a, b) => (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === 'name') return (a, b) => a.name.localeCompare(b.name);
    return () => 0; 
  };

  // sắp xếp sản phẩm 
  const query = searchQuery.toLowerCase().trim();
  const comparator = getSortComparator();
  if (query !== '') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(query);
      const bStarts = b.name.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return comparator(a, b);
    });
  } else if (sortBy !== 'featured') {
    filteredProducts = [...filteredProducts].sort(comparator);
  }

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedPriceRange('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedBrand !== 'all' || selectedPriceRange !== 'all';

  if (!isLoaded) {
    return <ProductsPageSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
    <section className="relative min-h-[50vh] flex items-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=2070&auto=format&fit=crop"
            alt="Products Hero"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-br from-blue-900/90 to-indigo-900/70" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Sản phẩm của chúng tôi
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            Khám phá bộ sưu tập laptop đa dạng từ các thương hiệu hàng đầu
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Bộ lọc</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Danh mục</h4>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Thương hiệu</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedBrand === brand.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Mức giá</h4>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedPriceRange === range.id
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {range.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm laptop, hãng, thông số..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <p className="text-gray-600">
                    Hiển thị <span className="font-semibold text-gray-900">{filteredProducts.length}</span> sản phẩm
                  </p>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Filter className="h-5 w-5" />
                    <span>Bộ lọc</span>
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Nổi bật</option>
                    <option value="price-asc">Giá tăng dần</option>
                    <option value="price-desc">Giá giảm dần</option>
                    <option value="name">Tên A-Z</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <p className="text-xl text-gray-600 mb-4">Không tìm thấy sản phẩm phù hợp</p>
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xóa bộ lọc và xem tất cả
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showFilters && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-60 lg:hidden" 
            onClick={() => setShowFilters(false)}
          />
          <div 
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl overflow-y-auto z-70 lg:hidden animate-slide-in" 
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Bộ lọc</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Danh mục</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Thương hiệu</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        setSelectedBrand(brand.id);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedBrand === brand.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Mức giá</h4>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setSelectedPriceRange(range.id);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedPriceRange === range.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 sticky bottom-0 pt-4 pb-2 bg-white border-t border-gray-200">
                <button
                  onClick={() => {
                    resetFilters();
                    setShowFilters(false);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Xóa bộ lọc
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slide-in {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
            .animate-slide-in {
              animation: slide-in 0.3s ease-out;
            }
          `}</style>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}