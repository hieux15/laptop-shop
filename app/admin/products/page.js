'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Package, Plus, Edit, Trash2, Save, X,
  Search, Eye, EyeOff, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import {
  getAdminProducts,
  getCategories,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
} from '@/app/actions/adminProduct';

const ITEMS_PER_PAGE = 10;

const EMPTY_FORM = {
  name: '',
  brandId: '',
  categoryId: '',
  price: '',
  originalPrice: '',
  image: '',
  isVisible: true,
  stock: '0',
  description: '',
  cpu: '',
  ram: '',
  storage: '',
  display: '',
  graphics: '',
  battery: '',
};

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all ${
            t.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {t.type === 'success' ? (
            <CheckCircle size={18} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="shrink-0 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterVisible, setFilterVisible] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/products');
      return;
    }
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        getAdminProducts(),
        getCategories(),
        getBrands(),
      ]);
      
      if (productsRes.success) setProducts(productsRes.products);
      if (categoriesRes.success) setCategories(categoriesRes.categories);
      if (brandsRes.success) setBrands(brandsRes.brands);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter((p) => {
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchCat = !filterCategory || p.categoryId === parseInt(filterCategory);
      const matchBrand = !filterBrand || p.brandId === parseInt(filterBrand);
      const matchVisible =
        filterVisible === ''
          ? true
          : filterVisible === 'true'
          ? p.isVisible
          : !p.isVisible;
      return matchSearch && matchCat && matchBrand && matchVisible;
    });
  }, [products, searchQuery, filterCategory, filterBrand, filterVisible]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const pagedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brandId: product.brandId.toString(),
      categoryId: product.categoryId.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      image: product.image || '',
      isVisible: product.isVisible,
      stock: product.stock.toString(),
      description: product.description || '',
      cpu: product.specs?.cpu || '',
      ram: product.specs?.ram || '',
      storage: product.specs?.storage || '',
      display: product.specs?.screen || '',
      graphics: product.specs?.gpu || '',
      battery: product.specs?.battery || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      name: formData.name,
      brandId: formData.brandId,
      categoryId: formData.categoryId,
      price: formData.price,
      originalPrice: formData.originalPrice || null,
      image: formData.image,
      isVisible: formData.isVisible,
      description: formData.description,
      specs: {
        cpu: formData.cpu,
        ram: formData.ram,
        storage: formData.storage,
        screen: formData.display,
        gpu: formData.graphics,
        battery: formData.battery,
      },
    };

    if (!editingProduct) {
      payload.stock = formData.stock;
    }

    try {
      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, payload);
        if (result.success) {
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingProduct.id
                ? {
                    ...p,
                    name: payload.name,
                    brandId: parseInt(payload.brandId),
                    brand: brands.find((b) => b.id === parseInt(payload.brandId))?.name || p.brand,
                    categoryId: parseInt(payload.categoryId),
                    category: categories.find((c) => c.id === parseInt(payload.categoryId))?.name || p.category,
                    price: parseInt(payload.price),
                    originalPrice: payload.originalPrice ? parseInt(payload.originalPrice) : null,
                    image: payload.image || p.image,
                    isVisible: payload.isVisible,
                    description: payload.description,
                    specs: payload.specs,
                  }
                : p
            )
          );
          addToast('Cập nhật sản phẩm thành công!', 'success');
          resetForm();
        } else {
          addToast(result.error || 'Cập nhật thất bại', 'error');
        }
      } else {
        result = await createProduct(payload);
        if (result.success) {
          addToast('Thêm sản phẩm mới thành công!', 'success');
          resetForm();
          fetchData();
        } else {
          addToast(result.error || 'Thêm sản phẩm thất bại', 'error');
        }
      }
    } catch (err) {
      addToast('Có lỗi xảy ra', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (product) => {
    if (product.orderCount > 0) {
      if (!confirm(`Sản phẩm "${product.name}" đã có trong ${product.orderCount} đơn hàng và không thể xóa. Bạn có muốn ẨN sản phẩm thay vì xóa không?`)) return;
      handleToggleVisible(product.id, false);
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa "${product.name}"? Hành động này không thể hoàn tác.`)) return;

    setDeletingId(product.id);
    deleteProduct(product.id).then((result) => {
      setDeletingId(null);
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        addToast('Đã xóa sản phẩm thành công!', 'success');
      } else {
        addToast(result.error || 'Xóa thất bại', 'error');
      }
    });
  };

  const handleToggleVisible = (id, newVisible) => {
    setTogglingId(id);
    toggleProductVisibility(id, newVisible).then((result) => {
      setTogglingId(null);
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isVisible: newVisible } : p))
        );
        addToast(newVisible ? 'Đã hiển thị sản phẩm' : 'Đã ẩn sản phẩm', 'success');
      } else {
        addToast(result.error || 'Cập nhật thất bại', 'error');
      }
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const statsVisible = products.filter((p) => p.isVisible).length;
  const statsHidden = products.length - statsVisible;

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-500 mt-1">Quản lý tất cả sản phẩm trong cửa hàng</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng sản phẩm', value: products.length, color: 'blue' },
            { label: 'Đang hiển thị', value: statsVisible, color: 'green' },
            { label: 'Đang ẩn', value: statsHidden, color: 'gray' },
            { label: 'Kết quả lọc', value: filteredProducts.length, color: 'purple' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-50 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tên, thương hiệu, danh mục..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              value={filterBrand}
              onChange={(e) => { setFilterBrand(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả thương hiệu</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <select
              value={filterVisible}
              onChange={(e) => { setFilterVisible(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang hiển thị</option>
              <option value="false">Đang ẩn</option>
            </select>
            {(searchQuery || filterCategory || filterBrand || filterVisible) && (
              <button
                onClick={() => {
                  setSearchQuery(''); setFilterCategory(''); setFilterBrand(''); setFilterVisible(''); setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {pagedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">Không tìm thấy sản phẩm</p>
              <p className="text-sm text-gray-400">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Danh mục</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tồn kho</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-gray-900">
                            {product.price.toLocaleString('vi-VN')}₫
                          </p>
                          {product.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">
                              {product.originalPrice.toLocaleString('vi-VN')}₫
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-orange-600' : 'text-green-600'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => handleToggleVisible(product.id, !product.isVisible)}
                            disabled={togglingId === product.id}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition ${
                              product.isVisible
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {togglingId === product.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : product.isVisible ? (
                              <Eye size={12} />
                            ) : (
                              <EyeOff size={12} />
                            )}
                            {product.isVisible ? 'Hiển thị' : 'Đã ẩn'}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditForm(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              disabled={deletingId === product.id}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Xóa"
                            >
                              {deletingId === product.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} / {filteredProducts.length} sản phẩm
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .reduce((acc, p, idx, arr) => {
                        if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        p === '...' ? (
                          <span key={`dots-${idx}`} className="px-2 text-gray-400">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                              p === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? `Chỉnh sửa: ${editingProduct.name}` : 'Thêm sản phẩm mới'}
              </h3>
              <button onClick={resetForm} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Thông tin cơ bản</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên sản phẩm <span className="text-red-500">*</span></label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleInputChange} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Thương hiệu <span className="text-red-500">*</span></label>
                    <select
                      name="brandId" value={formData.brandId}
                      onChange={handleInputChange} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn thương hiệu --</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục <span className="text-red-500">*</span></label>
                    <select
                      name="categoryId" value={formData.categoryId}
                      onChange={handleInputChange} required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URL hình ảnh</label>
                    <input
                      type="text" name="image" value={formData.image}
                      onChange={handleInputChange}
                      placeholder="/products/laptop-1.webp"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                    <textarea
                      name="description" value={formData.description}
                      onChange={handleInputChange} rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {editingProduct ? 'Giá bán' : 'Giá & Kho hàng ban đầu'}
                </h4>
                <div className={`grid grid-cols-1 gap-4 ${editingProduct ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá bán (₫) <span className="text-red-500">*</span></label>
                    <input
                      type="number" name="price" value={formData.price}
                      onChange={handleInputChange} required min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá gốc (₫)</label>
                    <input
                      type="number" name="originalPrice" value={formData.originalPrice}
                      onChange={handleInputChange} min="0"
                      placeholder="Để trống nếu không có"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {!editingProduct && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tồn kho ban đầu <span className="text-red-500">*</span></label>
                      <input
                        type="number" name="stock" value={formData.stock}
                        onChange={handleInputChange} required min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2.5 cursor-pointer w-fit">
                    <input
                      type="checkbox" name="isVisible"
                      checked={formData.isVisible}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Hiển thị sản phẩm trên cửa hàng</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Thông số kỹ thuật</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'cpu', label: 'CPU', placeholder: 'Intel Core i7-13700H' },
                    { name: 'ram', label: 'RAM', placeholder: '16GB DDR5' },
                    { name: 'storage', label: 'Ổ cứng', placeholder: '512GB NVMe SSD' },
                    { name: 'display', label: 'Màn hình', placeholder: '15.6" FHD IPS 144Hz' },
                    { name: 'graphics', label: 'Card đồ họa', placeholder: 'NVIDIA RTX 4060' },
                    { name: 'battery', label: 'Pin', placeholder: '72Wh, lên đến 8 giờ' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                      <input
                        type="text" name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button" onClick={resetForm}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit" disabled={isSaving}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}