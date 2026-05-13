'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { getOrderDetailAction } from '@/app/actions/order';

function BankTransferQR({ orderId, total, receiverName }) {
  const BANK_ID = 'vietcombank';
  const ACCOUNT_NO = '0123456789';
  const ACCOUNT_NAME = 'CONG TY LAPTOP PRO VN';
  const content = `LAPTOP ${orderId} ${receiverName}`.toUpperCase();

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center mt-6">
      <h3 className="font-bold text-gray-900 mb-1">Quét mã để thanh toán</h3>
      <p className="text-sm text-gray-500 mb-4">Mở app ngân hàng và quét mã QR bên dưới</p>
      
      <div className="flex justify-center mb-4">
        <img
          src={qrUrl}
          alt="QR chuyển khoản"
          className="w-56 h-56 rounded-xl border border-gray-200"
        />
      </div>

      <div className="bg-white rounded-xl p-4 text-left space-y-2 text-sm border border-yellow-100">
        <div className="flex justify-between">
          <span className="text-gray-500">Ngân hàng:</span>
          <span className="font-medium">Vietcombank</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tài khoản:</span>
          <span className="font-medium font-mono">{ACCOUNT_NO}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Chủ tài khoản:</span>
          <span className="font-medium">{ACCOUNT_NAME}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Số tiền:</span>
          <span className="font-bold text-blue-600">{total.toLocaleString('vi-VN')} ₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Nội dung CK:</span>
          <span className="font-medium text-blue-600">{content}</span>
        </div>
      </div>

      <p className="text-xs text-yellow-700 mt-4 bg-yellow-100 rounded-lg p-2">
        Đơn hàng sẽ được xác nhận sau khi chúng tôi nhận được thanh toán
      </p>
    </div>
  );
}

function CheckoutResultContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status'); // Từ VNPay return
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderDetailAction(parseInt(orderId)).then(res => {
        if (res.success) {
          setOrder(res.order);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h1>
          <Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const isFailed = status === 'failed' || status === 'invalid_signature' || status === 'db_error';

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        
        {/* Success / Error card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mb-6 flex justify-center">
            {isFailed ? (
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="h-12 w-12 text-red-600" />
              </div>
            ) : (
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isFailed ? 'Thanh toán thất bại' : 'Đặt hàng thành công!'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isFailed 
              ? 'Có lỗi xảy ra trong quá trình thanh toán qua VNPay. Đơn hàng của bạn vẫn được ghi nhận nhưng chưa được thanh toán.' 
              : 'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.'}
          </p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
            <p className="text-lg font-bold text-blue-600 mb-3">#{order.id}</p>
            <p className="text-sm text-gray-500 mb-1">Tổng tiền:</p>
            <p className="text-2xl font-bold text-gray-900">{order.total.toLocaleString('vi-VN')} ₫</p>
            <p className="text-sm text-gray-500 mb-1 mt-3">Trạng thái thanh toán:</p>
            <p className={`font-semibold ${order.isPaid ? 'text-green-600' : isFailed ? 'text-red-600' : 'text-yellow-600'}`}>
              {order.isPaid
                ? `Đã thanh toán${order.paymentMethod === 'VNPAY' ? ' (VNPay)' : order.paymentMethod === 'BANK_TRANSFER' ? ' (Chuyển khoản)' : ''}`
                : order.paymentMethod === 'VNPAY' && isFailed
                  ? 'Thanh toán thất bại'
                  : order.paymentMethod === 'BANK_TRANSFER'
                    ? 'Chờ xác nhận chuyển khoản'
                    : 'Thanh toán khi nhận hàng'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/orders" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition text-center">
              Xem đơn hàng
            </Link>
            <Link href="/products" className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-300 transition text-center">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* QR nếu là chuyển khoản và chưa thanh toán */}
        {order.paymentMethod === 'BANK_TRANSFER' && !order.isPaid && (
          <BankTransferQR
            orderId={order.id}
            total={order.total}
            receiverName={order.receiverName}
          />
        )}

      </div>
    </div>
  );
}

import { Suspense } from 'react';

export default function CheckoutResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <CheckoutResultContent />
    </Suspense>
  );
}
