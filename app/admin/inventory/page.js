'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Warehouse,
  Search,
  Plus,
  Minus,
  Edit,
  Save,
  X,
  AlertTriangle,
  Package,
  TrendingDown,
  TrendingUp,
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import {
  getInventoryList,
  getLowStockProducts,
  getInventoryStats,
  updateInventoryQuantity,
  adjustInventoryQuantity,
} from '@/app/actions/adminInventory';

const ITEMS_PER_PAGE = 15;

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
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

export default function AdminInventoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [inventories, setInventories] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [sortField, setSortField] = useState('productName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/inventory');
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
      const [inventoryRes, lowStockRes, statsRes] = await Promise.all([
        getInventoryList(),
        getLowStockProducts(5),
        getInventoryStats(),
      ]);
      
      if (inventoryRes.success) setInventories(inventoryRes.inventories);
      if (lowStockRes.success) setLowStockProducts(lowStockRes.products);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (err) {
      console.error('Error fetching data:', err);
      addToast('Lỗi khi tải dữ liệu', 'error');
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

  const filteredInventories = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return inventories.filter((inv) => {
      const matchSearch =
        !q ||
        inv.productName.toLowerCase().includes(q) ||
        inv.brand.toLowerCase().includes(q) ||
        inv.category.toLowerCase().includes(q);
      
      const matchStock =
        filterStock === '' ||
        (filterStock === 'low' && inv.quantity <= 5) ||
        (filterStock === 'out' && inv.quantity === 0) ||
        (filterStock === 'in' && inv.quantity > 0);
      
      return matchSearch && matchStock;
    });
  }, [inventories, searchQuery, filterStock]);

  const sortedInventories = useMemo(() => {
    return [...filteredInventories].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'quantity' || sortField === 'sold' || sortField === 'stockValue') {
        comparison = a[sortField] - b[sortField];
      } else {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        comparison = aVal.localeCompare(bVal);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredInventories, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedInventories.length / ITEMS_PER_PAGE);
  const pagedInventories = sortedInventories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleQuickAdjust = async (inventoryId, adjustment) => {
    setUpdatingId(inventoryId);
    try {
      const result = await adjustInventoryQuantity(inventoryId, adjustment);
      if (result.success) {
        setInventories((prev) =>
          prev.map((inv) =>
            inv.id === inventoryId
              ? { ...inv, quantity: result.inventory.quantity }
              : inv
          )
        );
        addToast(adjustment > 0 ? 'Đã thêm vào kho' : 'Đã trừ khỏi kho', 'success');
        
        // Refresh stats
        const statsRes = await getInventoryStats();
        if (statsRes.success) setStats(statsRes.stats);
      } else {
        addToast(result.error || 'Cập nhật thất bại', 'error');
      }
    } catch (err) {
      addToast('Có lỗi xảy ra', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditQuantity = (inventory) => {
    setEditingId(inventory.id);
    setEditQuantity(inventory.quantity.toString());
  };

  const handleSaveQuantity = async () => {
    if (!editingId || editQuantity === '') return;
    
    const newQuantity = parseInt(editQuantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      addToast('Số lượng không hợp lệ', 'error');
      return;
    }
    
    setUpdatingId(editingId);
    try {
      const result = await updateInventoryQuantity(editingId, newQuantity);
      if (result.success) {
        setInventories((prev) =>
          prev.map((inv) =>
            inv.id === editingId
              ? { ...inv, quantity: result.inventory.quantity }
              : inv
          )
        );
        addToast('Cập nhật kho hàng thành công', 'success');
        setEditingId(null);
        setEditQuantity('');
        
        // Refresh stats
        const statsRes = await getInventoryStats();
        if (statsRes.success) setStats(statsRes.stats);
      } else {
        addToast(result.error || 'Cập nhật thất bại', 'error');
      }
    } catch (err) {
      addToast('Có lỗi xảy ra', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditQuantity('');
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { label: 'Hết hàng', color: 'red', bg: 'bg-red-50', text: 'text-red-700' };
    if (quantity <= 5) return { label: 'Sắp hết', color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700' };
    return { label: 'Đủ hàng', color: 'green', bg: 'bg-green-50', text: 'text-green-700' };
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý kho hàng</h1>
            <p className="text-gray-500 mt-1">Theo dõi và quản lý tồn kho sản phẩm</p>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Tổng sản phẩm</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Trong kho</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.inStockCount}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm text-gray-500">Sắp hết</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm text-gray-500">Hết hàng</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</p>
            </div>
          </div>
        )}

        {/* Stock Value Card */}
        {stats && (
          <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Tổng giá trị tồn kho</p>
                <p className="text-3xl font-bold">
                  {stats.totalStockValue.toLocaleString('vi-VN')}₫
                </p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <Warehouse className="w-8 h-8" />
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-orange-900">Cảnh báo: {lowStockProducts.length} sản phẩm sắp hết hàng</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <span
                  key={product.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-sm text-orange-700 border border-orange-200"
                >
                  <span className="font-medium">{product.productName}</span>
                  <span className="text-orange-500">({product.quantity})</span>
                </span>
              ))}
              {lowStockProducts.length > 5 && (
                <span className="text-sm text-orange-600">
                  +{lowStockProducts.length - 5} sản phẩm khác
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filters */}
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
              value={filterStock}
              onChange={(e) => { setFilterStock(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="in">Đang có hàng</option>
              <option value="low">Sắp hết hàng</option>
              <option value="out">Hết hàng</option>
            </select>
            {(searchQuery || filterStock) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStock('');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-sm text-gray-600 hover:text-red-600 border border-gray-300 rounded-lg hover:border-red-300 transition"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {pagedInventories.length === 0 ? (
            <div className="text-center py-16">
              <Warehouse className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium mb-1">Không tìm thấy sản phẩm</p>
              <p className="text-sm text-gray-400">Thử thay đổi bộ lọc tìm kiếm</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('quantity')}>
                        <div className="flex items-center gap-1">
                          Tồn kho
                          {sortField === 'quantity' && (
                            sortDirection === 'asc' ? <ArrowUpDown size={12} /> : <ArrowUpDown size={12} />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('sold')}>
                        <div className="flex items-center gap-1">
                          Đã bán
                          {sortField === 'sold' && (
                            sortDirection === 'asc' ? <ArrowUpDown size={12} /> : <ArrowUpDown size={12} />
                          )}
                        </div>
                      </th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Giá trị kho</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pagedInventories.map((inv) => {
                      const status = getStockStatus(inv.quantity);
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <Image
                                  src={inv.productImage}
                                  alt={inv.productName}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{inv.productName}</p>
                                <p className="text-xs text-gray-500">{inv.brand} · {inv.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            {editingId === inv.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editQuantity}
                                  onChange={(e) => setEditQuantity(e.target.value)}
                                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  min="0"
                                  autoFocus
                                />
                                <button
                                  onClick={handleSaveQuantity}
                                  disabled={updatingId === inv.id}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                >
                                  {updatingId === inv.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <Save size={14} />
                                  )}
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <span className={`text-sm font-semibold ${inv.quantity === 0 ? 'text-red-600' : inv.quantity < 5 ? 'text-orange-600' : 'text-gray-900'}`}>
                                {inv.quantity}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-600">{inv.sold}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm font-medium text-gray-900">
                              {inv.stockValue.toLocaleString('vi-VN')}₫
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickAdjust(inv.id, -1)}
                                disabled={updatingId === inv.id || inv.quantity === 0}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Giảm 1"
                              >
                                {updatingId === inv.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Minus size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleQuickAdjust(inv.id, 1)}
                                disabled={updatingId === inv.id}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Tăng 1"
                              >
                                {updatingId === inv.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <Plus size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditQuantity(inv)}
                                disabled={editingId === inv.id || updatingId === inv.id}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                                title="Chỉnh sửa"
                              >
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedInventories.length)} / {sortedInventories.length} sản phẩm
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
    </>
  );
}