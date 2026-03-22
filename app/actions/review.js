'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// Kiểm tra user đã mua sản phẩm chưa
export async function checkPurchasedAction(productId) {
  const session = await auth();
  if (!session?.user?.id) return { purchased: false, reviewed: false };

  try {
    const userId = parseInt(session.user.id);

    // Kiểm tra đã mua (có đơn hàng DELIVERED chứa sản phẩm này)
    const purchased = await prisma.orderDetail.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: 'DELIVERED'
        }
      }
    });

    // Kiểm tra đã review chưa
    const reviewed = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    return {
      purchased: !!purchased,
      reviewed: !!reviewed,
      review: reviewed ? {
        ...reviewed,
        rating: reviewed.rating,
      } : null
    };
  } catch (e) {
    console.error(e);
    return { purchased: false, reviewed: false };
  }
}

export async function createReviewAction({ productId, rating, comment }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Chưa đăng nhập' };

  try {
    const userId = parseInt(session.user.id);

    // Kiểm tra đã mua chưa
    const purchased = await prisma.orderDetail.findFirst({
      where: {
        productId,
        order: { userId, status: 'DELIVERED' }
      }
    });
    if (!purchased) return { success: false, error: 'Bạn cần mua sản phẩm này trước khi đánh giá' };

    // Kiểm tra đã review chưa
    const existing = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId } }
    });
    if (existing) return { success: false, error: 'Bạn đã đánh giá sản phẩm này rồi' };

    // Validate
    if (rating < 1 || rating > 5) return { success: false, error: 'Số sao không hợp lệ' };

    const review = await prisma.review.create({
      data: { userId, productId, rating, comment: comment || null },
      include: { user: { select: { id: true, fullName: true } } }
    });

    return { success: true, review };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Đánh giá thất bại' };
  }
}

export async function getReviewsAction(productId) {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' }
    });

    const total = reviews.length;
    const avgRating = total > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
      : 0;

    // Đếm theo số sao
    const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length
    }));

    return { success: true, reviews, avgRating, total, ratingCounts };
  } catch (e) {
    console.error(e);
    return { success: false, reviews: [], avgRating: 0, total: 0, ratingCounts: [] };
  }
}