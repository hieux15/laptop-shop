'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  TicketPercent,
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  getAdminVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from '@/app/actions/adminVoucher';

const emptyForm = {
  code: '',
  discount: 10,
  maxDiscount: '',
  minOrder: 0,
  usageLimit: 100,
  isActive: true,
  expiredAt: '',
};

export default function AdminVouchersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/vouchers');
      return;
    }
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') fetchVouchers();
  }, [status, session, router]);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminVouchers();
      if (result.success) setVouchers(result.vouchers);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      code: v.code,
      discount: v.discount,
      maxDiscount: v.maxDiscount != null ? String(v.maxDiscount) : '',
      minOrder: v.minOrder,
      usageLimit: v.usageLimit,
      isActive: v.isActive,
      expiredAt: v.expiredAt ? v.expiredAt.slice(0, 16) : '',
    });
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
    setError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        expiredAt: form.expiredAt || null,
      };
      const result = editing
        ? await updateVoucher(editing.id, payload)
        : await createVoucher(payload);
      if (result.success) {
        closeModal();
        fetchVouchers();
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (e) {
      setError('Có lỗi xảy ra');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Xóa mã "${code}"?`)) return;
    const result = await deleteVoucher(id);
    if (result.success) fetchVouchers();
    else alert(result.error || 'Xóa thất bại');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const filtered = vouchers.filter(
    (v) =>
      !search ||
      v.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
          <p className="text-gray-500 mt-1">Tạo và quản lý voucher</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          <Plus size={18} />
          Thêm mã
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Tìm mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <TicketPercent className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có mã giảm giá</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Mã
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Giảm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Đơn tối thiểu
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Đã dùng / Giới hạn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Hết hạn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                      {v.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {v.discount}%
                      {v.maxDiscount != null && (
                        <span className="text-gray-500">
                          {' '}
                          (tối đa {v.maxDiscount.toLocaleString('vi-VN')}₫)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {v.minOrder.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {v.usedCount} / {v.usageLimit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {v.expiredAt
                        ? new Date(v.expiredAt).toLocaleString('vi-VN')
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                          v.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {v.isActive ? 'Đang bật' : 'Tắt'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(v)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex"
                        title="Sửa"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id, v.code)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg inline-flex"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editing ? 'Sửa voucher' : 'Thêm voucher'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã voucher *
                </label>
                <input
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, code: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono uppercase"
                  placeholder="SALE10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm (%) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.discount}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      discount: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giảm tối đa (₫) — để trống = không giới hạn
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.maxDiscount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, maxDiscount: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="500000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn tối thiểu (₫) *
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.minOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      minOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn số lần dùng *
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      usageLimit: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hết hạn — để trống = không giới hạn thời gian
                </label>
                <input
                  type="datetime-local"
                  value={form.expiredAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiredAt: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Đang kích hoạt</span>
              </label>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg p-2">
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
