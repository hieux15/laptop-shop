'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getOrderDetailAction, cancelOrderAction } from '@/app/actions/order';
import { createReviewAction, checkPurchasedAction } from '@/app/actions/review';
import toast from 'react-hot-toast';
import {
  Home, ChevronRight, Calendar, MapPin, Phone, CreditCard,
  Truck, CheckCircle2, Clock, XCircle, Package, ArrowLeft, Star
} from 'lucide-react';

const STATUS_CONFIG = {
  PENDING:   { label: 'Chờ xác nhận', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock },
  CONFIRMED: { label: 'Đã xác nhận',  color: 'text-blue-600',   bgColor: 'bg-blue-50',   icon: Package },
  SHIPPING:  { label: 'Đang giao',    color: 'text-purple-600', bgColor: 'bg-purple-50', icon: Truck },
  DELIVERED: { label: 'Đã giao',      color: 'text-green-600',  bgColor: 'bg-green-50',  icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy',       color: 'text-red-600',    bgColor: 'bg-red-50',    icon: XCircle },
};

const PAYMENT_LABELS = {
  COD:           'Thanh toán khi nhận hàng (COD)',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng (VietQR)',
  VNPAY:         'VNPay',
};

// Component hiển thị QR VietQR cho đơn hàng
function OrderVietQR({ order }) {
  const BANK_ID = 'vietcombank';
  const ACCOUNT_NO = '0123456789';
  const ACCOUNT_NAME = 'CONG TY LAPTOP PRO VN';
  const content = `LAPTOP ${order.id} ${order.receiverName}`.toUpperCase();

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${order.total}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">Quét mã QR để thanh toán</p>
      <div className="flex justify-center mb-3">
        <img
          src={qrUrl}
          alt="QR thanh toán"
          className="w-40 h-40 rounded-lg border border-gray-200"
        />
      </div>
      <div className="text-xs text-left space-y-1 bg-white rounded-lg p-3 border border-yellow-100">
        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng:</span>
          <span className="font-medium">Vietcombank</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền:</span>
          <span className="font-bold text-blue-600">{order.total.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung:</span>
          <span className="font-medium text-blue-600 text-right">{content}</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];

// ── Star Rating ──────────────────────────────────────────
function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}
        >
          <Star
            size={32}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Review Modal ─────────────────────────────────────────
function ReviewModal({ product, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createReviewAction({
      productId: product.id,
      rating,
      comment,
    });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Đánh giá thành công!');
      onSuccess(product.id);
      onClose();
    } else {
      toast.error(result.error || 'Đánh giá thất bại');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Đánh giá sản phẩm</h3>
        <p className="text-sm text-gray-500 mb-6 truncate">{product.name}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Số sao *</label>
            <StarRating value={rating} onChange={setRating} />
            <p className="text-sm text-gray-500 mt-2">
              {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'][rating]}
            </p>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function OrderDetailPage() {
  const { id } = useParams();
  const { status } = useSession();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  // reviewedIds: set các productId đã review
  const [reviewedIds, setReviewedIds] = useState(new Set());
  const [reviewingProduct, setReviewingProduct] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      getOrderDetailAction(parseInt(id)).then(async result => {
        if (result.success) {
          setOrder(result.order);

          // Nếu đơn đã giao → check từng sản phẩm đã review chưa
          if (result.order.status === 'DELIVERED') {
            const checks = await Promise.all(
              result.order.orderDetails.map(d =>
                checkPurchasedAction(d.product.id)
              )
            );
            const ids = new Set(
              result.order.orderDetails
                .filter((_, i) => checks[i].reviewed)
                .map(d => d.product.id)
            );
            setReviewedIds(ids);
          }
        } else {
          router.push('/orders');
        }
        setIsLoading(false);
      });
    }
  }, [status, id]);

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này không?')) return;
    setIsCancelling(true);
    const result = await cancelOrderAction(order.id);
    setIsCancelling(false);
    if (result.success) {
      toast.success('Đã hủy đơn hàng');
      setOrder(prev => ({ ...prev, status: 'CANCELLED' }));
    } else {
      toast.error(result.error || 'Hủy đơn thất bại');
    }
  };

  const handleReviewSuccess = (productId) => {
    setReviewedIds(prev => new Set([...prev, productId]));
  };

  if (isLoading || status === 'loading') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusInfo.icon;
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const isDelivered = order.status === 'DELIVERED';
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition">
              <Home size={16} /><span>Trang chủ</span>
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link href="/orders" className="hover:text-blue-600 transition">Đơn hàng</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium">#{order.id}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">Đơn hàng #{order.id}</h1>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}>
                    <StatusIcon size={15} />
                    {statusInfo.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={15} />
                  <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                  Quay lại
                </Link>
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition text-sm disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    {isCancelling ? 'Đang hủy...' : 'Hủy đơn'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h2>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200 z-0" />
                <div
                  className="absolute left-0 top-5 h-0.5 bg-blue-500 z-0 transition-all duration-500"
                  style={{ width: currentStepIndex >= 0 ? `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
                />
                {STATUS_STEPS.map((step, index) => {
                  const stepInfo = STATUS_CONFIG[step];
                  const StepIcon = stepInfo.icon;
                  const isDone = currentStepIndex >= index;
                  return (
                    <div key={step} className="flex flex-col items-center z-10 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                        <StepIcon size={18} />
                      </div>
                      <span className={`mt-2 text-xs font-medium text-center ${isDone ? 'text-blue-600' : 'text-gray-400'}`}>
                        {stepInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Sản phẩm */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
                <div className="space-y-3">
                  {order.orderDetails.map(detail => {
                    const isReviewed = reviewedIds.has(detail.product.id);
                    return (
                      <div key={detail.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                          {detail.product.image && (
                            <Image src={detail.product.image} alt={detail.product.name} fill className="object-contain" sizes="64px" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${detail.product.id}`} className="font-medium text-gray-900 hover:text-blue-600 transition line-clamp-2 text-sm">
                            {detail.product.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">Số lượng: {detail.quantity}</p>

                          {/* Nút đánh giá — chỉ hiện khi DELIVERED */}
                          {isDelivered && (
                            <div className="mt-2">
                              {isReviewed ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                                  <CheckCircle2 size={13} />
                                  Đã đánh giá
                                </span>
                              ) : (
                                <button
                                  onClick={() => setReviewingProduct(detail.product)}
                                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg font-medium transition border border-yellow-200"
                                >
                                  <Star size={13} className="fill-yellow-400 text-yellow-400" />
                                  Đánh giá sản phẩm
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-gray-900 text-sm">{(detail.price * detail.quantity).toLocaleString('vi-VN')} ₫</p>
                          <p className="text-xs text-gray-500">{detail.price.toLocaleString('vi-VN')} ₫/sp</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thông tin giao hàng */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Thông tin giao hàng</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Người nhận</p>
                      <p className="font-medium text-gray-900">{order.receiverName} — {order.receiverPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={15} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{order.street}, {order.city}, {order.province}</p>
                    </div>
                  </div>
                  {order.note && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                        <Package size={15} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500">Ghi chú</p>
                        <p className="font-medium text-gray-900">{order.note}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Thanh toán */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
                <h2 className="font-bold text-gray-900 mb-4">Tóm tắt</h2>
                <div className="space-y-3 text-sm">
                  {order.orderDetails.map(detail => (
                    <div key={detail.id} className="flex justify-between text-gray-600">
                      <span className="truncate mr-2">{detail.product.name} x{detail.quantity}</span>
                      <span className="shrink-0">{(detail.price * detail.quantity).toLocaleString('vi-VN')} ₫</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Tổng cộng:</span>
                    <span className="text-xl font-bold text-blue-600">{order.total.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 text-gray-600">
                    <CreditCard size={15} className="text-gray-400 shrink-0" />
                    <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
                  </div>
                  
                {/* Hiển thị QR nếu là chuyển khoản và ĐANG ĐỢI khách quét tiền */}
                  {order.paymentMethod === 'BANK_TRANSFER' && order.status === 'PENDING' && (
                    <div className="mt-4 rounded-lg">
                      <OrderVietQR order={order} />
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Vui lòng quét mã để thanh toán. QR sẽ tự ẩn sau khi đơn được xác nhận.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingProduct && (
        <ReviewModal
          product={reviewingProduct}
          onClose={() => setReviewingProduct(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
    </>
  );
}