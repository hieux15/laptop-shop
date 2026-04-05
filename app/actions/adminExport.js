'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function exportOrdersToExcel(startDate, endDate) {
  await checkAdmin();
  try {
    const where = {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59.999Z'),
      },
    };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { fullName: true, email: true } },
        orderDetails: {
          include: {
            product: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        customer: o.user?.fullName || o.receiverName,
        email: o.user?.email || '',
        receiverPhone: o.receiverPhone,
        address: `${o.street}, ${o.city}, ${o.province}`,
        paymentMethod: o.paymentMethod,
        status: o.status,
        total: Number(o.total),
        items: o.orderDetails
          .map((d) => `${d.product?.name} (x${d.quantity})`)
          .join(', '),
        createdAt: o.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    console.error('exportOrdersToExcel error:', e);
    return { success: false, error: e.message };
  }
}

export async function exportRevenueByMonth(year, month) {
  await checkAdmin();
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const dailyRevenue = {};
    orders.forEach((o) => {
      const day = o.createdAt.getDate();
      const key = `${day}/${month}/${year}`;
      if (!dailyRevenue[key]) {
        dailyRevenue[key] = {
          date: key,
          orderCount: 0,
          revenue: 0,
        };
      }
      dailyRevenue[key].orderCount += 1;
      dailyRevenue[key].revenue += Number(o.total);
    });

    const totalRevenue = Object.values(dailyRevenue).reduce(
      (sum, d) => sum + d.revenue,
      0
    );
    const totalOrders = orders.length;

    return {
      success: true,
      dailyData: Object.values(dailyRevenue),
      summary: {
        month,
        year,
        totalOrders,
        totalRevenue,
      },
    };
  } catch (e) {
    console.error('exportRevenueByMonth error:', e);
    return { success: false, error: e.message };
  }
}