'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function getAdminUsers() {
  const session = await checkAdmin();
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { orders: true }
        },
        orders: {
          where: { status: { not: 'CANCELLED' } },
          select: { total: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      currentUserId: session.user.id,
      users: users.map(u => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        phone: u.phone || '',
        isActive: u.isActive,
        orderCount: u._count.orders,
        totalSpent: u.orders.reduce((sum, o) => sum + Number(o.total), 0),
        createdAt: u.createdAt.toLocaleDateString('vi-VN')
      }))
    };
  } catch (e) {
    console.error('getAdminUsers error:', e);
    return { success: false, users: [], error: e.message };
  }
}

export async function updateUserStatus(userId, isActive) {
  const session = await checkAdmin();
  try {
    // Prevent modifying own account
    if (session.user.id === parseInt(userId)) {
      return { success: false, error: 'Không thể thay đổi trạng thái tài khoản của chính mình' };
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { role: true }
    });

    // Prevent modifying admin accounts
    if (user?.role === 'ADMIN') {
      return { success: false, error: 'Không thể thay đổi trạng thái tài khoản Admin' };
    }

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { isActive }
    });

    return { success: true };
  } catch (e) {
    console.error('updateUserStatus error:', e);
    return { success: false, error: 'Cập nhật trạng thái thất bại' };
  }
}

export async function getUserDetails(userId) {
  await checkAdmin();
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        orders: {
          include: {
            orderDetails: {
              include: {
                product: { select: { id: true, name: true, image: true } }
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        reviews: {
          include: {
            product: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: { orders: true, reviews: true }
        }
      }
    });

    if (!user) {
      return { success: false, error: 'Không tìm thấy người dùng' };
    }

    return {
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toLocaleDateString('vi-VN'),
        totalOrders: user._count.orders,
        totalReviews: user._count.reviews,
        orders: user.orders.map(o => ({
          id: o.id,
          status: o.status,
          total: Number(o.total),
          paymentMethod: o.paymentMethod,
          createdAt: o.createdAt.toLocaleDateString('vi-VN'),
          items: o.orderDetails.length
        })),
        reviews: user.reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          product: r.product,
          createdAt: r.createdAt.toLocaleDateString('vi-VN')
        }))
      }
    };
  } catch (e) {
    console.error('getUserDetails error:', e);
    return { success: false, error: e.message };
  }
}