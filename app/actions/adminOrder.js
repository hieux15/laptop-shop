'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { sendStatusUpdateEmail } from './orderEmails';

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
        isPaid: o.isPaid,
        status: o.status,
        total: Number(o.total),
        discountAmount: o.discountAmount ?? 0,
        voucherCode: o.voucherCode,
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
    // Lấy trạng thái cũ trước khi update
    const orderBefore = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      select: { status: true }
    });

    if (!orderBefore) {
      return { success: false, error: 'Đơn hàng không tồn tại' };
    }

    // Update status
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: newStatus }
    });

    // Gửi email thông báo (không chờ đợi để không block response)
    if (orderBefore.status !== newStatus) {
      sendStatusUpdateEmail(parseInt(orderId), newStatus, orderBefore.status).catch(error =>
        console.error('Failed to send status update email:', error)
      );
    }

    return { success: true };
  } catch (e) {
    console.error('updateOrderStatus error:', e);
    return { success: false, error: 'Cập nhật trạng thái thất bại' };
  }
}

export async function confirmBankPaymentAction(orderId) {
  await checkAdmin();
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      select: { paymentMethod: true, isPaid: true }
    });

    if (!order) return { success: false, error: 'Đơn hàng không tồn tại' };
    if (order.paymentMethod !== 'BANK_TRANSFER') {
      return { success: false, error: 'Chỉ áp dụng cho đơn chuyển khoản' };
    }
    if (order.isPaid) return { success: false, error: 'Đơn hàng đã được xác nhận thanh toán' };

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { isPaid: true }
    });

    return { success: true };
  } catch (e) {
    console.error('confirmBankPaymentAction error:', e);
    return { success: false, error: 'Xác nhận thanh toán thất bại' };
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