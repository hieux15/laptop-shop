'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useSession } from 'next-auth/react';
import { createOrderAction, getLastOrderAddressAction } from '@/app/actions/order';
import toast from 'react-hot-toast';
import { Home, ChevronRight, CheckCircle, AlertCircle, Banknote, Landmark, Wallet } from 'lucide-react';
import { CheckoutSkeleton } from '@/app/(client)/components/Skeleton';

const PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
  'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
  'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
  'Bình Thuận', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Đắk Nông',
  'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Giang',
  'Hà Nam', 'Hà Tĩnh', 'Hải Dương', 'Hậu Giang', 'Hòa Bình',
  'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu',
  'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định',
  'Nghệ An', 'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên',
  'Quảng Bình', 'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị',
  'Sóc Trăng', 'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên',
  'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh', 'Tuyên Quang',
  'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
];

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Thanh toán khi nhận hàng (COD)', icon: Banknote },
  { id: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng (VietQR)', icon: Landmark },
  { id: 'VNPAY', label: 'VNPay', icon: Wallet },
];

// Component hiển thị QR VietQR sau khi đặt hàng
function BankTransferQR({ orderId, total, receiverName }) {
  const BANK_ID = 'vietcombank';
  const ACCOUNT_NO = '0123456789';
  const ACCOUNT_NAME = 'CONG TY LAPTOP PRO VN';
  const content = `LAPTOP ${orderId} ${receiverName}`.toUpperCase();

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
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

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, isLoaded, getSubtotal, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderPaymentMethod, setOrderPaymentMethod] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    receiverName: '',
    receiverPhone: '',
    street: '',
    city: '',
    province: '',
    paymentMethod: 'COD',
    note: '',
  });

  // Lấy thông tin user khi đăng nhập
  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/user/profile');
          const data = await res.json();
          if (data && (data.fullName || data.phone)) {
            setFormData(prev => ({
              ...prev,
              receiverName: data.fullName || session.user.name || '',
              receiverPhone: data.phone || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }
    fetchUserData();
  }, [session]);

  useEffect(() => {
  if (session?.user) {
    getLastOrderAddressAction().then(result => {
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          receiverName: result.address.receiverName,
          receiverPhone: result.address.receiverPhone,
          street: result.address.street,
          city: result.address.city,
          province: result.address.province,
        }));
      }
    });
  }
}, [session]);

  const subtotal = getSubtotal();
  const freeShipThreshold = 20000000;
  const shippingFee = 30000;
  const shipping = subtotal >= freeShipThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.receiverName.trim()) newErrors.receiverName = 'Vui lòng nhập họ tên';
    if (!formData.receiverPhone.trim()) newErrors.receiverPhone = 'Vui lòng nhập số điện thoại';
    else if (!/^0\d{9}$/.test(formData.receiverPhone)) newErrors.receiverPhone = 'Số điện thoại không hợp lệ';
    if (!formData.street.trim()) newErrors.street = 'Vui lòng nhập địa chỉ';
    if (!formData.city.trim()) newErrors.city = 'Vui lòng nhập quận/huyện';
    if (!formData.province) newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await createOrderAction({
      ...formData,
      items: cartItems,
    });
    setIsSubmitting(false);

    if (result.success) {
      clearCart();
      setOrderId(result.orderId);
      setOrderTotal(total);
      setOrderPaymentMethod(formData.paymentMethod);
      setOrderPlaced(true);
    } else {
      toast.error(result.error || 'Đặt hàng thất bại');
    }
  };

  if (!isLoaded) return <CheckoutSkeleton />;

  // Đặt hàng thành công
  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
          
          {/* Success card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
              <p className="text-lg font-bold text-blue-600 mb-3">#{orderId}</p>
              <p className="text-sm text-gray-500 mb-1">Tổng tiền:</p>
              <p className="text-2xl font-bold text-gray-900">{orderTotal.toLocaleString('vi-VN')} ₫</p>
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

          {/* QR nếu là chuyển khoản */}
          {orderPaymentMethod === 'BANK_TRANSFER' && (
            <BankTransferQR
              orderId={orderId}
              total={orderTotal}
              receiverName={formData.receiverName}
            />
          )}

        </div>
      </div>
    );
  }

  // Giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Quay lại mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center text-xs sm:text-sm text-gray-500">
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition">
            <Home size={16} /><span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} className="mx-2" />
          <Link href="/cart" className="hover:text-blue-600 transition">Giỏ hàng</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900 font-medium">Thanh toán</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán đơn hàng</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Thông tin giao hàng */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin giao hàng</h2>
                <div className="space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên *</label>
                      <input
                        type="text"
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.receiverName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.receiverName && <p className="text-red-500 text-sm mt-1">{errors.receiverName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        name="receiverPhone"
                        value={formData.receiverPhone}
                        onChange={handleChange}
                        placeholder="0912345678"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.receiverPhone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.receiverPhone && <p className="text-red-500 text-sm mt-1">{errors.receiverPhone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ (số nhà, tên đường) *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="123 Đường Lê Lợi"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Quận 1"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố *</label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.province ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">-- Chọn tỉnh/thành --</option>
                        {PROVINCES.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Ghi chú thêm cho đơn hàng..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50 transition ${formData.paymentMethod === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <method.icon className="ml-3 text-blue-600" size={28} />
                      <span className="ml-2 font-medium text-gray-900">{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Hướng dẫn chuyển khoản */}
                {formData.paymentMethod === 'BANK_TRANSFER' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-gray-700">
                    <p className="font-bold mb-2">Thông tin chuyển khoản:</p>
                    <p>Ngân hàng: <span className="font-semibold">Vietcombank</span></p>
                    <p>Số tài khoản: <span className="font-semibold">0123456789</span></p>
                    <p>Chủ tài khoản: <span className="font-semibold">CÔNG TY LAPTOP PRO VN</span></p>
                    <p className="mt-2 text-yellow-700">Nội dung: Họ tên + Số điện thoại</p>
                  </div>
                )}

                {formData.paymentMethod === 'VNPAY' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                    Bạn sẽ được chuyển đến cổng thanh toán VNPay sau khi xác nhận đơn hàng.
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang xử lý...
                  </div>
                ) : 'Đặt hàng'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng ({cartItems.length} sản phẩm)</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                      <p className="text-gray-500 text-sm">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm shrink-0">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shipping === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')} ₫`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                    ✓ Miễn phí vận chuyển cho đơn từ 20 triệu
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{total.toLocaleString('vi-VN')} ₫</span>
              </div>

              <Link
                href="/cart"
                className="mt-4 w-full inline-block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
              >
                Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}