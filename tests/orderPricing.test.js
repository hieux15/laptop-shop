import { describe, it, expect } from 'vitest';
import {
  FREE_SHIP_THRESHOLD,
  SHIPPING_FEE,
  normalizeVoucherCode,
  computeShipping,
  computeDiscountAmount,
  computeOrderTotal,
} from '@/lib/orderPricing';

describe('lib/orderPricing', () => {
  it('normalizeVoucherCode: trims + uppercases', () => {
    expect(normalizeVoucherCode('  abC-10  ')).toBe('ABC-10');
  });

  it('normalizeVoucherCode: returns empty string for non-string input', () => {
    expect(normalizeVoucherCode(null)).toBe('');
    expect(normalizeVoucherCode(undefined)).toBe('');
    expect(normalizeVoucherCode(123)).toBe('');
  });

  it('computeShipping: free ship when subtotal >= threshold', () => {
    expect(computeShipping(FREE_SHIP_THRESHOLD)).toBe(0);
    expect(computeShipping(FREE_SHIP_THRESHOLD + 1)).toBe(0);
  });

  it('computeShipping: charges fee when subtotal < threshold', () => {
    expect(computeShipping(FREE_SHIP_THRESHOLD - 1)).toBe(SHIPPING_FEE);
  });

  it('computeDiscountAmount: percent discount with maxDiscount cap', () => {
    const subtotal = 1_000_000;
    const voucher = { discount: 50, maxDiscount: 100_000 };
    expect(computeDiscountAmount(subtotal, voucher)).toBe(100_000);
  });

  it('computeDiscountAmount: never exceeds subtotal', () => {
    const subtotal = 80_000;
    const voucher = { discount: 100, maxDiscount: null };
    expect(computeDiscountAmount(subtotal, voucher)).toBe(80_000);
  });

  it('computeOrderTotal: floors inputs and never below 0', () => {
    expect(computeOrderTotal(100_000.9, 30_000.9, 10_000.9)).toBe(120_000);
    expect(computeOrderTotal(10_000, 0, 999_999)).toBe(0);
  });
});
