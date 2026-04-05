'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Users, Search, Eye, Loader2, UserCheck, UserX, Mail, Phone, Calendar, ShoppingCart, MessageSquare } from 'lucide-react';
import { getAdminUsers, getUserDetails, updateUserStatus } from '@/app/actions/adminUser';

const orderStatusConfig = {
  PENDING: { label: 'Chờ xử lý', color: 'yellow' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'blue' },
  SHIPPING: { label: 'Đang giao', color: 'purple' },
  DELIVERED: { label: 'Đã giao', color: 'green' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/users');
      return;
    }
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, session]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminUsers();
      if (result.success) {
        setUsers(result.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (userId) => {
    setIsLoadingDetails(true);
    try {
      const result = await getUserDetails(userId);
      if (result.success) {
        setUserDetails(result.user);
        setSelectedUser(userId);
      } else {
        alert(result.error || 'Không thể tải thông tin');
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const actionText = newStatus ? 'kích hoạt' : 'khóa';
    if (!confirm(`Bạn có chắc muốn ${actionText} tài khoản này?`)) {
      return;
    }

    setUpdatingId(userId);
    try {
      const result = await updateUserStatus(userId, newStatus);
      if (result.success) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, isActive: newStatus } : u
        ));
        if (userDetails && userDetails.id === userId) {
          setUserDetails(prev => ({ ...prev, isActive: newStatus }));
        }
      } else {
        alert(result.error || 'Cập nhật thất bại');
      }
    } catch (err) {
      alert('Có lỗi xảy ra');
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchSearch = !searchQuery || 
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchStatus = !filterStatus || 
      (filterStatus === 'active' && user.isActive) || 
      (filterStatus === 'inactive' && !user.isActive);
    return matchSearch && matchStatus;
  });

  // Calculate stats
  const totalCustomers = users.length;
  const activeCustomers = users.filter(u => u.isActive).length;
  const inactiveCustomers = totalCustomers - activeCustomers;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
        <p className="text-gray-500 mt-1">Xem và quản lý tài khoản khách hàng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-blue-600" />
            <p className="text-xs text-gray-500">Tổng khách hàng</p>
          </div>
          <p className="text-xl font-bold text-blue-600">{totalCustomers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck size={16} className="text-green-600" />
            <p className="text-xs text-gray-500">Đang hoạt động</p>
          </div>
          <p className="text-xl font-bold text-green-600">{activeCustomers}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserX size={16} className="text-red-600" />
            <p className="text-xs text-gray-500">Đã khóa</p>
          </div>
          <p className="text-xl font-bold text-red-600">{inactiveCustomers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-64 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên, email, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Không tìm thấy khách hàng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Liên hệ</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Đơn hàng</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chi tiêu</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày đăng ký</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Mail size={12} />
                          <span className="truncate max-w-32">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Phone size={12} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {user.orderCount} đơn
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                      {user.totalSpent.toLocaleString('vi-VN')}₫
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewDetails(user.id)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive)}
                          disabled={updatingId === user.id}
                          className={`p-2 rounded-lg transition disabled:opacity-50 ${
                            user.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                        >
                          {updatingId === user.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : user.isActive ? (
                            <UserX size={16} />
                          ) : (
                            <UserCheck size={16} />
                          )}
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

      {/* User Details Modal */}
      {selectedUser && userDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Thông tin khách hàng</h2>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-60px)]">
                {/* User Info */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {userDetails.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{userDetails.fullName}</h3>
                      <p className="text-sm text-gray-500">ID: #{userDetails.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Số điện thoại</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.phone || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Ngày đăng ký</p>
                        <p className="text-sm font-medium text-gray-900">{userDetails.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {userDetails.isActive ? (
                        <UserCheck size={16} className="text-green-500" />
                      ) : (
                        <UserX size={16} className="text-red-500" />
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Trạng thái</p>
                        <p className={`text-sm font-medium ${userDetails.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {userDetails.isActive ? 'Hoạt động' : 'Đã khóa'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart size={16} className="text-blue-600" />
                      <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{userDetails.totalOrders}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-purple-600" />
                      <p className="text-sm text-gray-600">Tổng đánh giá</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{userDetails.totalReviews}</p>
                  </div>
                </div>

                {/* Recent Orders */}
                {userDetails.orders.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Đơn hàng gần đây</h4>
                    <div className="space-y-2">
                      {userDetails.orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Đơn #{order.id}</p>
                            <p className="text-xs text-gray-500">{order.createdAt} • {order.items} sản phẩm</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{order.total.toLocaleString('vi-VN')}₫</p>
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {orderStatusConfig[order.status]?.label || order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Reviews */}
                {userDetails.reviews.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Đánh giá gần đây</h4>
                    <div className="space-y-2">
                      {userDetails.reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900">{review.product.name}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">{review.createdAt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleToggleStatus(userDetails.id, userDetails.isActive)}
                    disabled={updatingId === userDetails.id}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition disabled:opacity-50 ${
                      userDetails.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {updatingId === userDetails.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        Đang xử lý...
                      </span>
                    ) : userDetails.isActive ? (
                      'Khóa tài khoản'
                    ) : (
                      'Kích hoạt tài khoản'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}