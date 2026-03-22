'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getOrdersAction, cancelOrderAction } from '@/app/actions/order';
import toast from 'react-hot-toast';
import {
  Home, ChevronRight, Package, Calendar, MapPin, Phone,
  CreditCard, Truck, CheckCircle2, Clock, XCircle, Eye, EyeOff
} from 'lucide-react';
import { OrdersSkeleton } from '@/app/(client)/components/Skeleton';

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xác nhận', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận',  color: 'text-blue-600',   bgColor: 'bg-blue-50',   icon: Package },
  SHIPPING:  { label: 'Đang giao',    color: 'text-purple-600', bgColor: 'bg-purple-50', icon: Truck },
  DELIVERED: { label: 'Đã giao',      color: 'text-green-600',  bgColor: 'bg-green-50',  icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy',       color: 'text-red-600',    bgColor: 'bg-red-50',    icon: XCircle },
};

const PAYMENT_LABELS = {
  COD:           'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  VNPAY:         'VNPay',
};

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
      return;
    }
    if (status === 'authenticated') {
      getOrdersAction().then(result => {
        if (result.success) setOrders(result.orders);
        setIsLoading(false);
      });
    }
  }, [status]);

  const handleCancel = async (orderId) => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    setCancellingId(orderId);
    const result = await cancelOrderAction(orderId);
    setCancellingId(null);
    if (result.success) {
      toast.success('Đã hủy đơn hàng');
      setOrders(prev => prev.map(o =>
        o.id === orderId ? { ...o, status: 'CANCELLED' } : o
      ));
    } else {
      toast.error(result.error || 'Hủy đơn thất bại');
    }
  };

  if (status === 'loading' || isLoading) return <OrdersSkeleton />;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition">
            <Home size={16} /><span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium">Lịch sử đơn hàng</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đơn hàng</h1>
          <p className="text-gray-600">Xem và theo dõi tất cả đơn hàng của bạn</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</h2>
            <p className="text-gray-600 mb-8">Hãy bắt đầu mua sắm ngay!</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              const StatusIcon = statusInfo.icon;
              const isExpanded = expandedId === order.id;
              const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">#{order.id}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                            <StatusIcon size={14} />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={15} />
                          <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {order.total.toLocaleString('vi-VN')} ₫
                        </p>
                        <p className="text-sm text-gray-500">{order.orderDetails.length} sản phẩm</p>
                      </div>
                    </div>

                    {/* Products preview */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {order.orderDetails.slice(0, 3).map(detail => (
                          <div key={detail.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                              {detail.product.image && (
                                <Image src={detail.product.image} alt={detail.product.name} fill className="object-contain" sizes="48px" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{detail.product.name}</p>
                              <p className="text-xs text-gray-500">x{detail.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.orderDetails.length > 3 && (
                          <div className="flex items-center justify-center p-2 bg-gray-50 rounded-xl">
                            <span className="text-sm font-medium text-gray-600">+{order.orderDetails.length - 3} sản phẩm khác</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-gray-400 shrink-0" />
                          <span className="truncate">{order.street}, {order.city}, {order.province}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={15} className="text-gray-400" />
                          <span>{order.receiverPhone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <Link
  href={`/orders/${order.id}`}
  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-medium transition text-sm"
>
  <Eye size={16} />
  Xem chi tiết
</Link>

                        {canCancel && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={cancellingId === order.id}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition text-sm disabled:opacity-50"
                          >
                            <XCircle size={16} />
                            {cancellingId === order.id ? 'Đang hủy...' : 'Hủy đơn'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">

                      {/* Thông tin giao hàng */}
                      <div className="bg-white rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 mb-3">Thông tin giao hàng</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Người nhận:</span>
                            <p className="font-medium text-gray-900">{order.receiverName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Số điện thoại:</span>
                            <p className="font-medium text-gray-900">{order.receiverPhone}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-gray-500">Địa chỉ:</span>
                            <p className="font-medium text-gray-900">{order.street}, {order.city}, {order.province}</p>
                          </div>
                          {order.note && (
                            <div className="sm:col-span-2">
                              <span className="text-gray-500">Ghi chú:</span>
                              <p className="font-medium text-gray-900">{order.note}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sản phẩm */}
                      <div className="bg-white rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 mb-3">Sản phẩm đã đặt</h5>
                        <div className="space-y-3">
                          {order.orderDetails.map(detail => (
                            <div key={detail.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                                {detail.product.image && (
                                  <Image src={detail.product.image} alt={detail.product.name} fill className="object-contain" sizes="64px" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900">{detail.product.name}</p>
                                <p className="text-sm text-gray-500">Số lượng: {detail.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">{(detail.price * detail.quantity).toLocaleString('vi-VN')} ₫</p>
                                <p className="text-xs text-gray-500">{detail.price.toLocaleString('vi-VN')} ₫/sp</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Thanh toán */}
                      <div className="bg-white rounded-xl p-4">
                        <h5 className="font-bold text-gray-900 mb-3">Thanh toán</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard size={15} className="text-gray-400" />
                            <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-gray-100">
                            <span className="font-semibold text-gray-900">Tổng cộng:</span>
                            <span className="text-xl font-bold text-blue-600">{order.total.toLocaleString('vi-VN')} ₫</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}