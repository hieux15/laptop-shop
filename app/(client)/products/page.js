'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, X, Search, Check } from 'lucide-react';
import { priceRanges } from '../data/products';

const cpuOptions = [
  'Intel Core i5',
  'Intel Core i7',
  'Intel Core i9',
  'AMD Ryzen 7',
  'AMD Ryzen 9',
  'Apple M2',
  'Apple M3'
];

const ramOptions = [
  '8GB',
  '16GB',
  '32GB'
];

const storageOptions = [
  '256GB',
  '512GB',
  '1TB'
];


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
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('categories') ? searchParams.get('categories').split(',') : []
  );
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get('brands') ? searchParams.get('brands').split(',') : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('price') || 'all');
  const [selectedCpu, setSelectedCpu] = useState(
    searchParams.get('cpu') ? searchParams.get('cpu').split(',') : []
  );
  const [selectedRam, setSelectedRam] = useState(
    searchParams.get('ram') ? searchParams.get('ram').split(',') : []
  );
  const [selectedStorage, setSelectedStorage] = useState(
    searchParams.get('storage') ? searchParams.get('storage').split(',') : []
  );


  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/brands')
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      } catch (e) {
        console.error('Failed to fetch data:', e);
        setProducts([]);
        setCategories([]);
        setBrands([]);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchData();
  }, []);

  // Sync state to URL parameters
  useEffect(() => {
    if (!isLoaded) return;
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (selectedPriceRange && selectedPriceRange !== 'all') params.set('price', selectedPriceRange);
    if (selectedCpu.length > 0) params.set('cpu', selectedCpu.join(','));
    if (selectedRam.length > 0) params.set('ram', selectedRam.join(','));
    if (selectedStorage.length > 0) params.set('storage', selectedStorage.join(','));
    if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);

    window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
  }, [searchQuery, selectedCategories, selectedBrands, selectedPriceRange, selectedCpu, selectedRam, selectedStorage, sortBy, pathname, router, isLoaded]);

  // Handle Multi-selections
  const toggleCategory = (slug) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  const toggleBrand = (name) => {
    setSelectedBrands(prev =>
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
    );
  };

  const toggleCpu = (cpu) => {
    setSelectedCpu(prev =>
      prev.includes(cpu) ? prev.filter(c => c !== cpu) : [...prev, cpu]
    );
  };

  const toggleRam = (ram) => {
    setSelectedRam(prev =>
      prev.includes(ram) ? prev.filter(r => r !== ram) : [...prev, ram]
    );
  };

  const toggleStorage = (storage) => {
    setSelectedStorage(prev =>
      prev.includes(storage) ? prev.filter(s => s !== storage) : [...prev, storage]
    );
  };



  const removeFilter = (type, value) => {
    if (type === 'q') setSearchQuery('');
    if (type === 'category') setSelectedCategories(prev => prev.filter(c => c !== value));
    if (type === 'brand') setSelectedBrands(prev => prev.filter(b => b !== value));
    if (type === 'price') setSelectedPriceRange('all');
    if (type === 'cpu') setSelectedCpu(prev => prev.filter(c => c !== value));
    if (type === 'ram') setSelectedRam(prev => prev.filter(r => r !== value));
    if (type === 'storage') setSelectedStorage(prev => prev.filter(s => s !== value));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRange('all');
    setSelectedCpu([]);
    setSelectedRam([]);
    setSelectedStorage([]);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategories.length > 0 || selectedBrands.length > 0 || selectedPriceRange !== 'all' || selectedCpu.length > 0 || selectedRam.length > 0 || selectedStorage.length > 0;

  // Perform filtering
  let filteredProducts = products.filter(product => {
    const searchMatch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs?.cpu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs?.ram?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs?.storage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.specs?.graphics?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If selectedCategories array has elements, check if product belongs to them
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);

    // If selectedBrands array has elements, check if product's brand is included
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);

    const priceRange = priceRanges.find(r => r.id === selectedPriceRange);
    const priceMatch = !priceRange || selectedPriceRange === 'all' ||
      (product.price >= priceRange.min && product.price <= priceRange.max);

    // Specs matching
    const cpuMatch = selectedCpu.length === 0 || selectedCpu.some(cpu =>
      product.specs?.cpu?.toLowerCase().includes(cpu.toLowerCase())
    );
    const ramMatch = selectedRam.length === 0 || selectedRam.some(ram =>
      product.specs?.ram?.toLowerCase().includes(ram.toLowerCase())
    );
    const storageMatch = selectedStorage.length === 0 || selectedStorage.some(storage =>
      product.specs?.storage?.toLowerCase().includes(storage.toLowerCase())
    );

    return searchMatch && categoryMatch && brandMatch && priceMatch && cpuMatch && ramMatch && storageMatch;
  });

  const getSortComparator = () => {
    if (sortBy === 'price-asc') return (a, b) => a.price - b.price;
    if (sortBy === 'price-desc') return (a, b) => b.price - a.price;
    if (sortBy === 'rating') return (a, b) => (b.rating ?? 0) - (a.rating ?? 0);
    if (sortBy === 'name') return (a, b) => a.name.localeCompare(b.name);

    if (sortBy === 'featured') {
      return (a, b) => {
        const aHasDiscount = a.originalPrice > a.price ? 1 : 0;
        const bHasDiscount = b.originalPrice > b.price ? 1 : 0;
        if (bHasDiscount !== aHasDiscount) return bHasDiscount - aHasDiscount;

        const aDiscount = aHasDiscount ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const bDiscount = bHasDiscount ? (b.originalPrice - b.price) / b.originalPrice : 0;
        if (bDiscount !== aDiscount) return bDiscount - aDiscount;

        return new Date(b.createdAt) - new Date(a.createdAt);
      };
    }
  };

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
  } else {
    filteredProducts = [...filteredProducts].sort(comparator);
  }

  // Calculate dynamic count for each category based on CURRENT filters except category filter itself, but simplest is total products.
  const getCategoryCount = (slug) => products.filter(p => p.category === slug).length;

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
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Bộ lọc</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Danh mục</h4>
                  <div className="space-y-3">
                    {categories.map(category => {
                      const isSelected = selectedCategories.includes(category.slug);
                      const count = getCategoryCount(category.slug);
                      return (
                        <label key={category.id} className="flex items-center gap-3 w-full cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-500'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`flex-1 transition-colors ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>{category.name}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{count}</span>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleCategory(category.slug); }} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Thương hiệu</h4>
                  <div className="space-y-3">
                    {brands.map(brand => {
                      const isSelected = selectedBrands.includes(brand.name);
                      return (
                        <label key={brand.id} className="flex items-center gap-3 w-full cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-500'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`flex-1 transition-colors ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>{brand.name}</span>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleBrand(brand.name); }} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Mức giá</h4>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label key={range.id} className="flex items-center gap-3 w-full cursor-pointer group">
                        <div className="flex items-center h-5">
                          <input
                            type="radio"
                            name="priceRange"
                            value={range.id}
                            checked={selectedPriceRange === range.id}
                            onChange={(e) => { e.preventDefault(); setSelectedPriceRange(range.id); }}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                        </div>
                        <span className={`flex-1 transition-colors ${selectedPriceRange === range.id ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>
                          {range.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specs Filters */}
                <div className="pt-4 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h4>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">CPU</h5>
                    <div className="space-y-2">
                      {cpuOptions.map(cpu => {
                        const isSelected = selectedCpu.includes(cpu);
                        return (
                          <label key={cpu} className="flex items-center gap-3 w-full cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-500'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`flex-1 text-sm transition-colors ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>{cpu}</span>
                            <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleCpu(cpu); }} />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">RAM</h5>
                    <div className="space-y-2">
                      {ramOptions.map(ram => {
                        const isSelected = selectedRam.includes(ram);
                        return (
                          <label key={ram} className="flex items-center gap-3 w-full cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-500'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`flex-1 text-sm transition-colors ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>{ram}</span>
                            <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleRam(ram); }} />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-800 mb-2 text-sm">Ổ cứng</h5>
                    <div className="space-y-2">
                      {storageOptions.map(storage => {
                        const isSelected = selectedStorage.includes(storage);
                        return (
                          <label key={storage} className="flex items-center gap-3 w-full cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-500'}`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`flex-1 text-sm transition-colors ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 group-hover:text-blue-600'}`}>{storage}</span>
                            <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleStorage(storage); }} />
                          </label>
                        );
                      })}
                    </div>
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {/* Active filters tags */}
                {hasActiveFilters && (
                  <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <span className="text-sm font-semibold text-gray-700 mr-1">Đang lọc theo:</span>
                    
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                        Từ khóa: {searchQuery}
                        <button onClick={() => removeFilter('q')} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    )}
                    
                    {selectedCategories.map(catSlug => {
                      const catName = categories.find(c => c.slug === catSlug)?.name || catSlug;
                      return (
                        <span key={catSlug} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                          {catName}
                          <button onClick={() => removeFilter('category', catSlug)} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </span>
                      )
                    })}

                    {selectedBrands.map(brand => (
                      <span key={brand} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                        {brand}
                        <button onClick={() => removeFilter('brand', brand)} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}

                    {selectedPriceRange !== 'all' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                        {priceRanges.find(r => r.id === selectedPriceRange)?.name}
                        <button onClick={() => removeFilter('price')} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    )}

                    {selectedCpu.map(cpu => (
                      <span key={cpu} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                        CPU: {cpu}
                        <button onClick={() => removeFilter('cpu', cpu)} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}

                    {selectedRam.map(ram => (
                      <span key={ram} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                        RAM: {ram}
                        <button onClick={() => removeFilter('ram', ram)} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}

                    {selectedStorage.map(storage => (
                      <span key={storage} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100 shadow-sm transition hover:shadow">
                        Ổ cứng: {storage}
                        <button onClick={() => removeFilter('storage', storage)} className="hover:bg-blue-200 hover:text-red-500 p-0.5 rounded-full transition-colors"><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}



                    <button onClick={resetFilters} className="text-sm text-red-500 hover:text-red-700 font-semibold ml-2 underline underline-offset-2">Xóa tất cả bộ lọc</button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <p className="text-gray-600">
                    Hiển thị <span className="font-semibold text-gray-900 text-lg px-1">{filteredProducts.length}</span> sản phẩm
                  </p>

                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setShowFilters(true)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                    >
                      <Filter className="h-5 w-5" />
                      <span>Lọc tĩnh</span>
                    </button>

                    <div className="flex items-center gap-2 flex-1 sm:flex-none">
                      <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">Sắp xếp:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700"
                      >
                        <option value="featured">Nổi bật</option>
                        <option value="price-asc">Giá tăng dần</option>
                        <option value="price-desc">Giá giảm dần</option>
                        <option value="rating">Đánh giá cao nhất</option>
                        <option value="name">Tên A-Z</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-900 font-semibold mb-2">Không tìm thấy sản phẩm</p>
                  <p className="text-gray-500 mb-6">Xin lỗi, không có sản phẩm nào phù hợp với tiêu chí lọc của bạn.</p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                  >
                    Xóa hoàn toàn bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <>
          <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-60 lg:hidden transition-opacity" 
            onClick={() => setShowFilters(false)}
          />
          <div 
            className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl overflow-y-auto z-70 lg:hidden animate-slide-in flex flex-col" 
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">Bộ lọc & Sắp xếp</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  Danh mục
                  {selectedCategories.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedCategories.length} đã chọn</span>}
                </h4>
                <div className="space-y-3">
                  {categories.map(category => {
                    const isSelected = selectedCategories.includes(category.slug);
                    return (
                      <label key={category.id} className="flex items-center gap-3 w-full cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={`flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{category.name}</span>
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleCategory(category.slug); }} />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8 hidden">
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
                  Thương hiệu
                  {selectedBrands.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedBrands.length} đã chọn</span>}
                </h4>
                <div className="space-y-3">
                  {brands.map(brand => {
                    const isSelected = selectedBrands.includes(brand.name);
                    return (
                      <label key={brand.id} className="flex items-center gap-3 w-full cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={`flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{brand.name}</span>
                        <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleBrand(brand.name); }} />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Mức giá</h4>
                <div className="space-y-3">
                  {priceRanges.map(range => (
                    <label key={range.id} className="flex items-center gap-3 w-full cursor-pointer group">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="priceRangeMobile"
                          value={range.id}
                          checked={selectedPriceRange === range.id}
                          onChange={(e) => { e.preventDefault(); setSelectedPriceRange(range.id); }}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <span className={`flex-1 ${selectedPriceRange === range.id ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                        {range.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-8 border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Thông số kỹ thuật</h4>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center justify-between text-sm">
                    CPU
                    {selectedCpu.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedCpu.length} đã chọn</span>}
                  </h5>
                  <div className="space-y-3">
                    {cpuOptions.map(cpu => {
                      const isSelected = selectedCpu.includes(cpu);
                      return (
                        <label key={cpu} className="flex items-center gap-3 w-full cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{cpu}</span>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleCpu(cpu); }} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center justify-between text-sm">
                    RAM
                    {selectedRam.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedRam.length} đã chọn</span>}
                  </h5>
                  <div className="space-y-3">
                    {ramOptions.map(ram => {
                      const isSelected = selectedRam.includes(ram);
                      return (
                        <label key={ram} className="flex items-center gap-3 w-full cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{ram}</span>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleRam(ram); }} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3 flex items-center justify-between text-sm">
                    Ổ cứng
                    {selectedStorage.length > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedStorage.length} đã chọn</span>}
                  </h5>
                  <div className="space-y-3">
                    {storageOptions.map(storage => {
                      const isSelected = selectedStorage.includes(storage);
                      return (
                        <label key={storage} className="flex items-center gap-3 w-full cursor-pointer group">
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                          <span className={`flex-1 ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>{storage}</span>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={(e) => { e.preventDefault(); toggleStorage(storage); }} />
                        </label>
                      );
                    })}
                  </div>
                </div>


              </div>
            </div>

            <div className="p-4 bg-white border-t border-gray-100 shadow-lg mt-auto">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    resetFilters();
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Thiết lập lại
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
                >
                  Xem {filteredProducts.length} kết quả
                </button>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes slide-in {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in {
              animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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