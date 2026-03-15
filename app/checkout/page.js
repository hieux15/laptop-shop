"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, CheckCircle, AlertCircle } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { CheckoutSkeleton } from "@/app/components/Skeleton";

export default function CheckoutPage() {
  const { cartItems, isLoaded, getSubtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!/^0\d{9}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Tính toán giá trị đơn hàng
    const orderSubtotal = getSubtotal();
    const freeShipThreshold = 20000000;
    const shippingFee = 30000;
    const orderShipping = orderSubtotal >= freeShipThreshold ? 0 : shippingFee;
    const orderTotal = orderSubtotal + orderShipping;

    // Lưu đơn hàng (có thể gửi đến API)
    const order = {
      id: "ORD-" + Date.now(),
      date: new Date().toLocaleString("vi-VN"),
      timestamp: Date.now(),
      customer: formData,
      items: cartItems,
      subtotal: orderSubtotal,
      shipping: orderShipping,
      total: orderTotal,
      status: "pending", // pending, processing, shipped, delivered, cancelled
    };

    // Lưu đơn hàng vào localStorage
    try {
      const existingOrders = localStorage.getItem("orders");
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.unshift(order); // Thêm đơn hàng mới vào đầu mảng
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Lỗi lưu đơn hàng:", error);
    }

    console.log("Đơn hàng:", order);

    setOrderId(order.id);
    setOrderTotal(orderTotal);
    clearCart(); // Xóa giỏ hàng từ CartContext
    setOrderPlaced(true);
    setIsSubmitting(false);
  };

  if (!isLoaded) {
    return <CheckoutSkeleton />;
  }

  const subtotal = getSubtotal();
  const freeShipThreshold = 20000000;
  const shippingFee = 30000;
  const shipping = subtotal >= freeShipThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  if (orderPlaced) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        {/* Breadcrumb */}
        <div className="bg-gray-50 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                <Home size={16} />
                <span>Trang chủ</span>
              </Link>
              <ChevronRight size={14} className="mx-2" />
              <span className="text-gray-900 font-medium">Thanh toán</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Đơn hàng thành công!
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận và sẽ
              được xử lý sớm.
            </p>
            <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
              <p className="text-sm text-gray-600 mb-2">Mã đơn hàng:</p>
              <p className="text-lg font-bold text-blue-600 mb-4">
                {orderId}
              </p>
              <p className="text-sm text-gray-600 mb-2">Tổng tiền:</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderTotal.toLocaleString("vi-VN")} ₫
              </p>
            </div>
            <p className="text-gray-600 mb-8">
              Email xác nhận đã được gửi đến{" "}
              <span className="font-semibold">{formData.email}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-center"
              >
                Tiếp tục mua sắm
              </Link>
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Quay lại mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-gray-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center text-xs sm:text-sm text-gray-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <Home size={16} />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link
              href="/cart"
              className="hover:text-blue-600 transition-colors"
            >
              Giỏ hàng
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 font-medium">Thanh toán</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Thanh toán đơn hàng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Thông tin giao hàng */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Thông tin giao hàng
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ tên *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Nguyễn Văn A"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                        placeholder="email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                        placeholder="0912345678"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? "border-red-500" : "border-gray-300"}`}
                      placeholder="123 Đường ABC, Phường XYZ"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  {/*bỏ */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thành phố *
                      </label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.city ? "border-red-500" : "border-gray-300"}`}
                      >
                        <option value="">-- Chọn thành phố --</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="haiphong">Hải Phòng</option>
                      </select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.district ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Quận 1"
                      />
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.district}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phường/Xã
                      </label>
                      <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phường Ben Nghé"
                      />
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <label
                    className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{
                      borderColor:
                        formData.paymentMethod === "cod"
                          ? "#2563eb"
                          : "#d1d5db",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                  </label>

                  <label
                    className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{
                      borderColor:
                        formData.paymentMethod === "card"
                          ? "#2563eb"
                          : "#d1d5db",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      Thẻ tín dụng / Ghi nợ
                    </span>
                  </label>

                  <label
                    className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                    style={{
                      borderColor:
                        formData.paymentMethod === "bank"
                          ? "#2563eb"
                          : "#d1d5db",
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium text-gray-900">
                      Chuyển khoản ngân hàng
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-500">x{item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {shipping === 0
                      ? "Miễn phí"
                      : shipping.toLocaleString("vi-VN") + " ₫"}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    ✓ Miễn phí vận chuyển cho đơn hàng từ 20 triệu đồng
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {total.toLocaleString("vi-VN")} ₫
                </span>
              </div>

              <Link
                href="/cart"
                className="mt-6 w-full inline-block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
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
