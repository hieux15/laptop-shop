'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminOrders() {
  await checkAdmin();
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        orderDetails: {
          include: {
            product: { select: { id: true, name: true, image: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      orders: orders.map(o => ({
        id: o.id,
        customer: o.user?.fullName || o.receiverName,
        email: o.user?.email || '',
        receiverName: o.receiverName,
        receiverPhone: o.receiverPhone,
        street: o.street,
        city: o.city,
        province: o.province,
        paymentMethod: o.paymentMethod,
        status: o.status,
        total: Number(o.total),
        note: o.note,
        items: o.orderDetails.length,
        orderDetails: o.orderDetails.map(d => ({
          id: d.id,
          quantity: d.quantity,
          price: Number(d.price),
          product: d.product
        })),
        createdAt: o.createdAt.toLocaleDateString('vi-VN')
      }))
    };
  } catch (e) {
    console.error('getAdminOrders error:', e);
    return { success: false, orders: [], error: e.message };
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  await checkAdmin();
  try {
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: newStatus }
    });
    return { success: true };
  } catch (e) {
    console.error('updateOrderStatus error:', e);
    return { success: false, error: 'Cập nhật trạng thái thất bại' };
  }
}

export async function getAdminDashboardStats() {
  await checkAdmin();
  try {
    const [totalProducts, totalOrders, totalUsers, orders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        include: {
          user: { select: { fullName: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const revenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } }
    });

    return {
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        revenue: Number(revenue._sum.total) || 0,
        recentOrders: orders.map(o => ({
          id: o.id,
          customer: o.user?.fullName || o.receiverName,
          total: Number(o.total),
          status: o.status,
          createdAt: o.createdAt.toLocaleDateString('vi-VN')
        }))
      }
    };
  } catch (e) {
    console.error('getAdminDashboardStats error:', e);
    return { success: false, stats: null, error: e.message };
  }
}