'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { normalizeVoucherCode } from '@/lib/orderPricing';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminVouchers() {
  await checkAdmin();
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return {
      success: true,
      vouchers: vouchers.map((v) => ({
        id: v.id,
        code: v.code,
        discount: v.discount,
        maxDiscount: v.maxDiscount,
        minOrder: v.minOrder,
        usageLimit: v.usageLimit,
        usedCount: v.usedCount,
        isActive: v.isActive,
        expiredAt: v.expiredAt ? v.expiredAt.toISOString() : null,
        createdAt: v.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    console.error('getAdminVouchers error:', e);
    return { success: false, vouchers: [], error: e.message };
  }
}

export async function createVoucher(data) {
  await checkAdmin();
  try {
    const code = normalizeVoucherCode(data.code);
    if (!code) {
      return { success: false, error: 'Mã voucher không được để trống' };
    }
    const discount = parseInt(data.discount, 10);
    if (Number.isNaN(discount) || discount < 1 || discount > 100) {
      return { success: false, error: 'Phần trăm giảm phải từ 1 đến 100' };
    }
    const minOrder = parseInt(data.minOrder, 10);
    if (Number.isNaN(minOrder) || minOrder < 0) {
      return { success: false, error: 'Đơn tối thiểu không hợp lệ' };
    }
    const usageLimit = parseInt(data.usageLimit, 10);
    if (Number.isNaN(usageLimit) || usageLimit < 1) {
      return { success: false, error: 'Giới hạn sử dụng phải >= 1' };
    }
    let maxDiscount = null;
    if (data.maxDiscount !== '' && data.maxDiscount != null) {
      const m = parseInt(data.maxDiscount, 10);
      if (Number.isNaN(m) || m < 0) {
        return { success: false, error: 'Giảm tối đa (₫) không hợp lệ' };
      }
      maxDiscount = m;
    }
    let expiredAt = null;
    if (data.expiredAt) {
      const d = new Date(data.expiredAt);
      if (!Number.isNaN(d.getTime())) expiredAt = d;
    }

    const voucher = await prisma.voucher.create({
      data: {
        code,
        discount,
        maxDiscount,
        minOrder,
        usageLimit,
        isActive: data.isActive !== false,
        expiredAt,
      },
    });
    return { success: true, voucher };
  } catch (e) {
    console.error('createVoucher error:', e);
    if (e.code === 'P2002') {
      return { success: false, error: 'Mã voucher đã tồn tại' };
    }
    return { success: false, error: e.message || 'Tạo voucher thất bại' };
  }
}

export async function updateVoucher(id, data) {
  await checkAdmin();
  try {
    const vid = parseInt(id, 10);
    const code = normalizeVoucherCode(data.code);
    if (!code) {
      return { success: false, error: 'Mã voucher không được để trống' };
    }
    const discount = parseInt(data.discount, 10);
    if (Number.isNaN(discount) || discount < 1 || discount > 100) {
      return { success: false, error: 'Phần trăm giảm phải từ 1 đến 100' };
    }
    const minOrder = parseInt(data.minOrder, 10);
    if (Number.isNaN(minOrder) || minOrder < 0) {
      return { success: false, error: 'Đơn tối thiểu không hợp lệ' };
    }
    const usageLimit = parseInt(data.usageLimit, 10);
    if (Number.isNaN(usageLimit) || usageLimit < 1) {
      return { success: false, error: 'Giới hạn sử dụng phải >= 1' };
    }
    let maxDiscount = null;
    if (data.maxDiscount !== '' && data.maxDiscount != null) {
      const m = parseInt(data.maxDiscount, 10);
      if (Number.isNaN(m) || m < 0) {
        return { success: false, error: 'Giảm tối đa (₫) không hợp lệ' };
      }
      maxDiscount = m;
    }
    let expiredAt = null;
    if (data.expiredAt) {
      const d = new Date(data.expiredAt);
      if (!Number.isNaN(d.getTime())) expiredAt = d;
    }

    const existing = await prisma.voucher.findUnique({ where: { id: vid } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy voucher' };
    }
    if (usageLimit < existing.usedCount) {
      return {
        success: false,
        error: `Giới hạn không được nhỏ hơn số lần đã dùng (${existing.usedCount})`,
      };
    }

    const voucher = await prisma.voucher.update({
      where: { id: vid },
      data: {
        code,
        discount,
        maxDiscount,
        minOrder,
        usageLimit,
        isActive: !!data.isActive,
        expiredAt,
      },
    });
    return { success: true, voucher };
  } catch (e) {
    console.error('updateVoucher error:', e);
    if (e.code === 'P2002') {
      return { success: false, error: 'Mã voucher đã tồn tại' };
    }
    return { success: false, error: e.message || 'Cập nhật thất bại' };
  }
}

export async function deleteVoucher(id) {
  await checkAdmin();
  try {
    await prisma.voucher.delete({
      where: { id: parseInt(id, 10) },
    });
    return { success: true };
  } catch (e) {
    console.error('deleteVoucher error:', e);
    return { success: false, error: 'Không thể xóa voucher (có thể đang được dùng trong đơn hàng)' };
  }
}
