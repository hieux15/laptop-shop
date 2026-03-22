"use client";

// Base skeleton với hiệu ứng pulse
export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

// Skeleton cho ProductCard trong grid
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 flex flex-col grow">
        <Skeleton className="h-3 w-16 mb-2" />
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-5 w-[75%] mb-3" />
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="mt-auto flex gap-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-10 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Skeleton cho trang chi tiết sản phẩm
export function ProductDetailSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-2xl space-y-4">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-[75%]" />
              <div className="space-y-3 pt-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-6">
                <Skeleton className="h-12 w-32 rounded-xl" />
                <Skeleton className="h-12 flex-1 rounded-xl" />
              </div>
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton cho trang giỏ hàng
export function CartSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                  <Skeleton className="h-20 w-20 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-[75%]" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 sticky top-8 space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2 py-4 border-y border-gray-100">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton cho trang đơn hàng
export function OrdersSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-[75%] mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6">
              <div className="flex justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-28" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-16 rounded-lg" />
                ))}
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-10 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton cho trang thanh toán
export function CheckoutSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-20 space-y-4">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-3 py-4 border-y border-gray-100">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
