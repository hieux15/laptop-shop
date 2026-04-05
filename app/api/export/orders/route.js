import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

const statusLabel = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  SHIPPING: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const paymentLabel = {
  COD: 'COD',
  BANK_TRANSFER: 'Chuyển khoản',
  VNPAY: 'VNPay',
};

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { startDate, endDate } = await request.json();

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

    // Prepare data for Excel
    const excelData = orders.map((o) => ({
      'Mã đơn': o.id,
      'Khách hàng': o.user?.fullName || o.receiverName,
      'Email': o.user?.email || '',
      'SĐT': o.receiverPhone,
      'Địa chỉ': `${o.street}, ${o.city}, ${o.province}`,
      'Thanh toán': paymentLabel[o.paymentMethod] || o.paymentMethod,
      'Trạng thái': statusLabel[o.status] || o.status,
      'Tổng tiền': Number(o.total),
      'Sản phẩm': o.orderDetails
        .map((d) => `${d.product?.name} (x${d.quantity})`)
        .join(', '),
      'Ngày đặt': o.createdAt.toLocaleString('vi-VN'),
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Đơn hàng');

    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map((key) => ({
      wch: Math.max(key.length, 15),
    }));
    ws['!cols'] = colWidths;

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const fileName = `don-hang-${startDate}-den-${endDate}.xlsx`;

    // Return as downloadable file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      },
    });
  } catch (e) {
    console.error('Export orders error:', e);
    return NextResponse.json({ error: 'Loi server' }, { status: 500 });
  }
}