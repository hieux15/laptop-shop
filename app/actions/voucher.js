'use server';

import { prisma } from '@/lib/prisma';
import {
  normalizeVoucherCode,
  computeDiscountAmount,
} from '@/lib/orderPricing';

/**
 * Dùng khi đặt hàng: không mã → không giảm; có mã → validate đầy đủ.
 * @returns {Promise<{ voucher: import('@prisma/client').Voucher | null; discountAmount: number; error?: string }>}
 */
export async function resolveVoucherForOrder(voucherCode, subtotal) {
  const normalized = normalizeVoucherCode(voucherCode);
  const sub = Math.floor(Number(subtotal) || 0);

  if (!normalized) {
    return { voucher: null, discountAmount: 0 };
  }

  if (sub <= 0) {
    return { voucher: null, discountAmount: 0, error: 'Giỏ hàng không hợp lệ' };
  }

  const voucher = await prisma.voucher.findUnique({
    where: { code: normalized },
  });

  if (!voucher) {
    return { error: 'Mã không tồn tại' };
  }
  if (!voucher.isActive) {
    return { error: 'Mã không còn hiệu lực' };
  }
  if (voucher.expiredAt && new Date(voucher.expiredAt) < new Date()) {
    return { error: 'Mã đã hết hạn' };
  }
  if (sub < voucher.minOrder) {
    return {
      error: `Đơn tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')} ₫ để dùng mã này`,
    };
  }
  if (voucher.usedCount >= voucher.usageLimit) {
    return { error: 'Mã đã hết lượt sử dụng' };
  }

  const discountAmount = computeDiscountAmount(sub, voucher);
  return { voucher, discountAmount };
}

/** Khách bấm "Áp dụng" ở checkout — bắt buộc có mã */
export async function validateVoucherAction(code, subtotal) {
  const normalized = normalizeVoucherCode(code);
  if (!normalized) {
    return { success: false, error: 'Vui lòng nhập mã giảm giá' };
  }

  const result = await resolveVoucherForOrder(code, subtotal);
  if (result.error) {
    return { success: false, error: result.error };
  }
  if (!result.voucher) {
    return { success: false, error: 'Mã không hợp lệ' };
  }

  return {
    success: true,
    discountAmount: result.discountAmount,
    voucherId: result.voucher.id,
    code: result.voucher.code,
  };
}
