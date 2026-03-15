"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {Home, ChevronRight, Package, Calendar, MapPin, Phone, CreditCard, 
  Truck, CheckCircle2, Clock, XCircle, Eye} from "lucide-react";
import { OrdersSkeleton } from "@/app/components/Skeleton";

const statusConfig = {
  pending: {
    label: "Chờ xử lý",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: Clock,
  },
  processing: {
    label: "Đang xử lý",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: Package,
  },
  shipped: {
    label: "Đã giao hàng",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    icon: Truck,
  },
  delivered: {
    label: "Đã nhận hàng",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem("orders");
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        // Sắp xếp theo thời gian mới nhất trước
        const sortedOrders = parsedOrders.sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Lỗi load đơn hàng:", error);
    }
    setIsLoaded(true);
  }, []);

  const getStatusConfig = (status) => {
    return statusConfig[status] || statusConfig.pending;
  };

  if (!isLoaded) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
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
            <span className="text-gray-900 font-medium">Lịch sử đơn hàng</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lịch sử đơn hàng
          </h1>
          <p className="text-gray-600">
            Xem và theo dõi tất cả đơn hàng của bạn
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusConfig(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {order.id}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bgColor} ${statusInfo.color}`}
                          >
                            <StatusIcon size={14} />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{order.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600 mb-1">
                          {order.total.toLocaleString("vi-VN")} ₫
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          Sản phẩm
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Số lượng: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">
                              +{order.items.length - 3} sản phẩm khác
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Customer Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="truncate">
                            {order.customer.address}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <span>{order.customer.phone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() =>
                            setSelectedOrder(
                              selectedOrder?.id === order.id ? null : order
                            )
                          }
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm"
                        >
                          <Eye size={16} />
                          {selectedOrder?.id === order.id
                            ? "Ẩn chi tiết"
                            : "Xem chi tiết"}
                        </button>
                        <Link
                          href="/products"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm"
                        >
                          Mua lại
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Order Details Expandable */}
                  {selectedOrder?.id === order.id && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">
                        Chi tiết đơn hàng
                      </h4>

                      {/* Customer Information */}
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h5 className="font-semibold text-gray-900 mb-3">
                          Thông tin khách hàng
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Họ tên:</span>
                            <p className="font-medium text-gray-900">
                              {order.customer.fullName}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <p className="font-medium text-gray-900">
                              {order.customer.email}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Số điện thoại:</span>
                            <p className="font-medium text-gray-900">
                              {order.customer.phone}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Địa chỉ:</span>
                            <p className="font-medium text-gray-900">
                              {order.customer.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h5 className="font-semibold text-gray-900 mb-3">
                          Sản phẩm đã đặt
                        </h5>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-gray-900 mb-1">
                                  {item.name}
                                </h6>
                                <p className="text-sm text-gray-500">
                                  {item.brand && (
                                    <span className="capitalize">
                                      {item.brand} •{" "}
                                    </span>
                                  )}
                                  Số lượng: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-gray-900">
                                  {(item.price * item.quantity).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  ₫
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.price.toLocaleString("vi-VN")} ₫/sản
                                  phẩm
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-white rounded-lg p-4">
                        <h5 className="font-semibold text-gray-900 mb-3">
                          Tóm tắt thanh toán
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Tạm tính:</span>
                            <span>
                              {order.subtotal.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Phí vận chuyển:</span>
                            <span
                              className={
                                order.shipping === 0
                                  ? "text-green-600 font-semibold"
                                  : ""
                              }
                            >
                              {order.shipping === 0
                                ? "Miễn phí"
                                : `${order.shipping.toLocaleString("vi-VN")} ₫`}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-base font-semibold text-gray-900">
                              Tổng cộng:
                            </span>
                            <span className="text-xl font-bold text-blue-600">
                              {order.total.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                            <CreditCard size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Phương thức thanh toán:{" "}
                              {order.customer.paymentMethod === "cod"
                                ? "Thanh toán khi nhận hàng (COD)"
                                : order.customer.paymentMethod === "card"
                                  ? "Thẻ tín dụng / Ghi nợ"
                                  : "Chuyển khoản ngân hàng"}
                            </span>
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
