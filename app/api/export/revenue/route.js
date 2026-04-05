import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

const monthNamesVietnamese = [
  '', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year, month } = await request.json();

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

    // Sort by date
    const sortedData = Object.values(dailyRevenue).sort((a, b) => {
      const dayA = parseInt(a.date.split('/')[0]);
      const dayB = parseInt(b.date.split('/')[0]);
      return dayA - dayB;
    });

    // Prepare data for Excel with Vietnamese headers
    const excelData = sortedData.map((d) => ({
      'Ngày': d.date,
      'Số đơn': d.orderCount,
      'Doanh thu': d.revenue,
    }));

    // Add summary row
    const totalRevenue = sortedData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = sortedData.reduce((sum, d) => sum + d.orderCount, 0);
    excelData.push({
      'Ngày': 'TỔNG CỘNG',
      'Số đơn': totalOrders,
      'Doanh thu': totalRevenue,
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Doanh thu');

    // Auto-size columns
    ws['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 20 },
    ];

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const monthLabel = monthNamesVietnamese[month] || `Tháng ${month}`;
    const fileName = `doanh-thu-${monthLabel}-${year}.xlsx`;

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch (e) {
    console.error('Export revenue error:', e);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}