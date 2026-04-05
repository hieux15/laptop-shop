'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getRevenueStats(period = '30days') {
  await checkAdmin();
  try {
    const now = new Date();
    let startDate;
    let dateFormat;
    let groupBy;

    // Calculate start date based on period
    switch (period) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
        break;
      case '12months':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFormat = 'month';
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFormat = 'day';
    }

    // Get orders within the period
    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { not: 'CANCELLED' }
      },
      select: {
        total: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by day or month
    const revenueMap = {};

    orders.forEach(order => {
      let key;
      if (dateFormat === 'day') {
        key = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
      } else {
        key = `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      }

      if (!revenueMap[key]) {
        revenueMap[key] = 0;
      }
      revenueMap[key] += Number(order.total);
    });

    // Fill missing dates with 0
    const stats = [];
    const current = new Date(startDate);

    while (current <= now) {
      let key;
      if (dateFormat === 'day') {
        key = current.toISOString().split('T')[0];
        stats.push({
          date: key,
          label: `${current.getDate()}/${current.getMonth() + 1}`,
          revenue: revenueMap[key] || 0
        });
        current.setDate(current.getDate() + 1);
      } else {
        key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
        stats.push({
          date: key,
          label: `Tháng ${current.getMonth() + 1}`,
          revenue: revenueMap[key] || 0
        });
        current.setMonth(current.getMonth() + 1);
      }
    }

    return { success: true, stats, period };
  } catch (e) {
    console.error('getRevenueStats error:', e);
    return { success: false, stats: [], error: e.message };
  }
}

export async function getTopProducts(limit = 5) {
  await checkAdmin();
  try {
    const topProducts = await prisma.orderDetail.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: limit
    });

    // Get product details
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        price: true,
        image: true
      }
    });

    // Combine data
    const result = topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        id: tp.productId,
        name: product?.name || 'Unknown',
        price: Number(product?.price) || 0,
        image: product?.image || '',
        totalSold: tp._sum.quantity
      };
    });

    return { success: true, products: result };
  } catch (e) {
    console.error('getTopProducts error:', e);
    return { success: false, products: [], error: e.message };
  }
}