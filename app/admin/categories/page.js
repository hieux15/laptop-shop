'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FolderOpen, Tags, Search, Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from '@/app/actions/adminCategory';
import { getAdminBrands, createBrand, updateBrand, deleteBrand } from '@/app/actions/adminBrand';

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('categories');
  const [isLoading, setIsLoading] = useState(true);
  
  // Categories state
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  
  // Brands state
  const [brands, setBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState('');
  const [brandError, setBrandError] = useState('');
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/categories');
      return;
    }
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchCategories();
      fetchBrands();
    }
  }, [status, session]);

  const fetchCategories = async () => {
    try {
      const result = await getAdminCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminBrands();
      if (result.success) {
        setBrands(result.brands);
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Category handlers
  const handleOpenCategoryModal = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category?.name || '');
    setCategoryError('');
    setIsCategoryModalOpen(true);
  };

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryError('');
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) {
      setCategoryError('Vui lòng nhập tên danh mục');
      return;
    }

    setIsSavingCategory(true);
    setCategoryError('');

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, categoryName);
      } else {
        result = await createCategory(categoryName);
      }

      if (result.success) {
        handleCloseCategoryModal();
        fetchCategories();
      } else {
        setCategoryError(result.error);
      }
    } catch (err) {
      setCategoryError('Có lỗi xảy ra');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
      return;
    }

    try {
      const result = await deleteCategory(id);
      if (!result.success) {
        alert(result.error);
      } else {
        fetchCategories();
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  // Brand handlers
  const handleOpenBrandModal = (brand = null) => {
    setEditingBrand(brand);
    setBrandName(brand?.name || '');
    setBrandLogo(brand?.logo || '');
    setBrandError('');
    setIsBrandModalOpen(true);
  };

  const handleCloseBrandModal = () => {
    setIsBrandModalOpen(false);
    setEditingBrand(null);
    setBrandName('');
    setBrandLogo('');
    setBrandError('');
  };

  const handleSaveBrand = async () => {
    if (!brandName.trim()) {
      setBrandError('Vui lòng nhập tên hãng');
      return;
    }

    setIsSavingBrand(true);
    setBrandError('');

    try {
      let result;
      if (editingBrand) {
        result = await updateBrand(editingBrand.id, brandName, brandLogo);
      } else {
        result = await createBrand(brandName, brandLogo);
      }

      if (result.success) {
        handleCloseBrandModal();
        fetchBrands();
      } else {
        setBrandError(result.error);
      }
    } catch (err) {
      setBrandError('Có lỗi xảy ra');
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (id, name) => {
    if (!confirm(`Bạn có chắc muốn xóa hãng "${name}"?`)) {
      return;
    }

    try {
      const result = await deleteBrand(id);
      if (!result.success) {
        alert(result.error);
      } else {
        fetchBrands();
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Danh mục & Hãng</h1>
        <p className="text-gray-500 mt-1">Quản lý danh mục sản phẩm và hãng sản xuất</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition ${
              activeTab === 'categories'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FolderOpen size={18} />
            Danh mục ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition ${
              activeTab === 'brands'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Tags size={18} />
            Hãng ({brands.length})
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="p-6">
            {/* Search + Add */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm danh mục..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                <Plus size={16} />
                Thêm danh mục
              </button>
            </div>

            {/* Table */}
            {filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có danh mục nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên danh mục</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Số sản phẩm</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <Package size={14} />
                            {category.productCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenCategoryModal(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Sửa"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === 'brands' && (
          <div className="p-6">
            {/* Search + Add */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm hãng..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleOpenBrandModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                <Plus size={16} />
                Thêm hãng
              </button>
            </div>

            {/* Table */}
            {filteredBrands.length === 0 ? (
              <div className="text-center py-12">
                <Tags className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có hãng nào</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Logo</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên hãng</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Số sản phẩm</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBrands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                            {brand.logo ? (
                              <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Tags size={20} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{brand.name}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                            <Package size={14} />
                            {brand.productCount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenBrandModal(brand)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Sửa"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteBrand(brand.id, brand.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </h2>

            {categoryError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {categoryError}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên danh mục
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Nhập tên danh mục"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseCategoryModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={isSavingCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-70"
              >
                {isSavingCategory ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Đang lưu...
                  </span>
                ) : editingCategory ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingBrand ? 'Sửa hãng' : 'Thêm hãng mới'}
            </h2>

            {brandError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {brandError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tên hãng
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Nhập tên hãng"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Logo (URL)
                </label>
                <input
                  type="text"
                  value={brandLogo}
                  onChange={(e) => setBrandLogo(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {brandLogo && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img src={brandLogo} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={handleCloseBrandModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveBrand}
                disabled={isSavingBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-70"
              >
                {isSavingBrand ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Đang lưu...
                  </span>
                ) : editingBrand ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}