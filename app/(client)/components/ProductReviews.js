'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getReviewsAction, createReviewAction, checkPurchasedAction } from '@/app/actions/review';
import toast from 'react-hot-toast';
import { Star, User } from 'lucide-react';

function StarRating({ value, onChange, readonly = false, size = 6 }) {
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
          className={readonly ? 'cursor-default' : 'cursor-pointer'}
        >
          <Star
            size={size * 4}
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

export default function ProductReviews({ productId }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [total, setTotal] = useState(0);
  const [ratingCounts, setRatingCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [purchased, setPurchased] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getReviewsAction(productId).then(result => {
      if (result.success) {
        setReviews(result.reviews);
        setAvgRating(result.avgRating);
        setTotal(result.total);
        setRatingCounts(result.ratingCounts);
      }
      setIsLoading(false);
    });
  }, [productId]);

  useEffect(() => {
    if (status === 'authenticated') {
      checkPurchasedAction(productId).then(result => {
        setPurchased(result.purchased);
        setReviewed(result.reviewed);
      });
    }
  }, [status, productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      router.push('/login');
      return;
    }
    setIsSubmitting(true);
    const result = await createReviewAction({ productId, rating, comment });
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Đánh giá thành công!');
      setReviewed(true);
      setComment('');
      // Thêm review mới vào đầu danh sách
      setReviews(prev => [{
        ...result.review,
        user: { fullName: session.user.name }
      }, ...prev]);
      setTotal(prev => prev + 1);
      setAvgRating(prev => ((prev * (total) + rating) / (total + 1)));
    } else {
      toast.error(result.error || 'Đánh giá thất bại');
    }
  };

  return (
    <div className="space-y-8">
      {/* Tổng quan rating */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>

        {total > 0 ? (
          <div className="flex flex-col sm:flex-row gap-8 mb-6">
            {/* Điểm trung bình */}
            <div className="flex flex-col items-center justify-center min-w-30">
              <span className="text-5xl font-black text-gray-900">{avgRating.toFixed(1)}</span>
              <StarRating value={Math.round(avgRating)} readonly size={5} />
              <span className="text-sm text-gray-500 mt-1">{total} đánh giá</span>
            </div>

            {/* Bar chart */}
            <div className="flex-1 space-y-2">
              {ratingCounts.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-4">{star}</span>
                  <Star size={14} className="fill-yellow-400 text-yellow-400 shrink-0" />
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-6">Chưa có đánh giá nào.</p>
        )}

        {/* Form viết review */}
        {status === 'authenticated' && purchased && !reviewed && (
          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">Viết đánh giá của bạn</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số sao *</label>
                <StarRating value={rating} onChange={setRating} size={7} />
              </div>
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </form>
          </div>
        )}

        {status === 'authenticated' && purchased && reviewed && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-green-600 font-medium">✓ Bạn đã đánh giá sản phẩm này</p>
          </div>
        )}

        {status === 'authenticated' && !purchased && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">Mua sản phẩm này để có thể đánh giá.</p>
          </div>
        )}

        {status === 'unauthenticated' && (
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              <button onClick={() => router.push('/login')} className="text-blue-600 font-medium hover:underline">Đăng nhập</button>
              {' '}để đánh giá sản phẩm.
            </p>
          </div>
        )}
      </div>

      {/* Danh sách review */}
      {!isLoading && reviews.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Tất cả đánh giá ({total})</h3>
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{review.user?.fullName || 'Người dùng'}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <StarRating value={review.rating} readonly size={4} />
                    {review.comment && (
                      <p className="text-gray-700 text-sm mt-2">{review.comment}</p>
                    )}
                    {review.isVerified && (
                      <span className="inline-block mt-2 text-xs text-green-600 font-medium">✓ Đã mua hàng</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}