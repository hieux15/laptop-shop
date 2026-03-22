'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, Eye, Truck, CheckCircle, Clock, XCircle, Loader2, CreditCard } from 'lucide-react';
import { getAdminOrders, updateOrderStatus } from '@/app/actions/adminOrder';

const statusConfig = {
  PENDING: { label: 'Chờ xử lý', color: 'yellow', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận', color: 'blue', icon: ShoppingCart },
  SHIPPING: { label: 'Đang giao', color: 'purple', icon: Truck },
  DELIVERED: { label: 'Đã giao', color: 'green', icon: CheckCircle },
  CANCELLED: { label: 'Đã hủy', color: 'red', icon: XCircle },
};

const paymentLabels = {
  COD: 'COD',
  BANK_TRANSFER: 'Bank',
  VNPAY: 'VNPay',
};

export default function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/admin/orders');
      return;
    }
    if (status === 'authenticated' && session.user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, session]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const result = await getAdminOrders();
      if (result.success) {
        setOrders(result.orders);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
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

  const filteredOrders = orders.filter(order => {
    const matchSearch = !searchQuery || 
      order.id.toString().includes(searchQuery) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.receiverPhone.includes(searchQuery);
    const matchStatus = !filterStatus || order.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getProductPreview = (orderDetails) => {
    if (!orderDetails || orderDetails.length === 0) return 'Không có sản phẩm';
    const firstProduct = orderDetails[0].product?.name || 'Sản phẩm';
    if (orderDetails.length === 1) {
      return `1 sản phẩm / ${firstProduct}`;
    }
    return `${orderDetails.length} sản phẩm / ${firstProduct}...`;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <p className="text-gray-500 mt-1">Quản lý tất cả đơn hàng trong cửa hàng</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = orders.filter((o) => o.status === key).length;
          const Icon = config.icon;
          return (
            <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={`text-${config.color}-600`} />
                <p className="text-xs text-gray-500">{config.label}</p>
              </div>
              <p className={`text-xl font-bold text-${config.color}-600`}>{count}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-64 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm mã đơn, tên KH, SĐT..."
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
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Không tìm thấy đơn hàng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const statusInfo = statusConfig[order.status] || statusConfig.PENDING;
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = selectedOrderId === order.id;

                  return (
                    <Fragment key={order.id}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3.5 text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                            <p className="text-xs text-gray-500">{order.receiverPhone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">
                          {getProductPreview(order.orderDetails)}
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-gray-900">
                          {order.total.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {paymentLabels[order.paymentMethod] || order.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className={`px-2 py-1 text-xs font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                              order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200' :
                              order.status === 'SHIPPING' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}
                          >
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <option key={key} value={key}>{config.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-500">
                          {order.createdAt}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => setSelectedOrderId(isExpanded ? null : order.id)}
                            className={`p-2 rounded-lg transition ${
                              isExpanded 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="8" className="p-0">
                            <div className="bg-gray-50 border-t border-gray-200 p-4">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-gray-500">Tên:</span>
                                      <span className="font-medium text-gray-900 ml-2">{order.customer}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">SĐT:</span>
                                      <span className="font-medium text-gray-900 ml-2">{order.receiverPhone}</span>
                                    </div>
                                    {order.email && (
                                      <div>
                                        <span className="text-gray-500">Email:</span>
                                        <span className="font-medium text-gray-900 ml-2">{order.email}</span>
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-gray-500">Địa chỉ:</span>
                                      <span className="font-medium text-gray-900 ml-2">{order.street}, {order.city}, {order.province}</span>
                                    </div>
                                    {order.note && (
                                      <div>
                                        <span className="text-gray-500">Ghi chú:</span>
                                        <span className="font-medium text-gray-900 ml-2">{order.note}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="bg-white rounded-lg p-4">
                                  <h4 className="font-semibold text-gray-900 mb-3">Tóm tắt thanh toán</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Tạm tính:</span>
                                      <span className="font-medium text-gray-900">{order.total.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-500">Phí vận chuyển:</span>
                                      <span className="font-medium text-gray-900">Miễn phí</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                                      <span className="font-semibold text-gray-900">Tổng cộng:</span>
                                      <span className="font-bold text-blue-600">{order.total.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="pt-1">
                                      <span className="text-gray-500">Phương thức:</span>
                                      <div className="flex items-center gap-2 mt-1">
                                        <CreditCard size={14} className="text-gray-400" />
                                        <span className="font-medium text-gray-900">{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Sản phẩm đã đặt</h4>
                                <div className="space-y-2">
                                  {order.orderDetails?.map((detail, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                      <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                        {detail.product?.image && (
                                          <img src={detail.product.image} alt="" className="w-full h-full object-cover" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">{detail.product?.name}</p>
                                        <p className="text-xs text-gray-500">x{detail.quantity} × {detail.price.toLocaleString('vi-VN')}₫</p>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900">{(detail.price * detail.quantity).toLocaleString('vi-VN')}₫</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}