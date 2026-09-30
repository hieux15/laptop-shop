import { describe, expect, it, vi } from 'vitest';
import { getPaymentMode, PAYMENT_MODE } from '@/lib/paymentMode';
import { completeMockPayment } from '@/lib/mockPayment';

describe('payment mode', () => {
  it('defaults to mock in local development and VNPAY in deployed environments', () => {
    expect(getPaymentMode({ NODE_ENV: 'development' })).toBe(PAYMENT_MODE.MOCK);
    expect(getPaymentMode({ NODE_ENV: 'production' })).toBe(PAYMENT_MODE.VNPAY);
  });

  it('uses an explicit valid payment mode', () => {
    expect(getPaymentMode({ NODE_ENV: 'production', PAYMENT_MODE: 'mock' })).toBe(PAYMENT_MODE.MOCK);
    expect(getPaymentMode({ NODE_ENV: 'development', PAYMENT_MODE: 'vnpay' })).toBe(PAYMENT_MODE.VNPAY);
  });
});

describe('mock payment completion', () => {
  it('marks an owned pending mock order paid and confirmed', async () => {
    const prisma = {
      order: {
        findFirst: vi.fn().mockResolvedValue({
          id: 12, paymentMethod: 'VNPAY_MOCK', isPaid: false, status: 'PENDING',
        }),
        updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      },
    };

    await expect(completeMockPayment(prisma, 7, 12)).resolves.toEqual({
      success: true,
      alreadyCompleted: false,
    });
    expect(prisma.order.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 12, userId: 7 },
    }));
    expect(prisma.order.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: 12, userId: 7, isPaid: false, status: 'PENDING' }),
      data: { isPaid: true, status: 'CONFIRMED' },
    }));
  });

  it('rejects an order that does not belong to the caller', async () => {
    const prisma = { order: { findFirst: vi.fn().mockResolvedValue(null) } };
    await expect(completeMockPayment(prisma, 7, 12)).resolves.toEqual({
      success: false,
      reason: 'not_found',
    });
  });

  it('allows a retry for an already paid mock order without updating it again', async () => {
    const prisma = {
      order: {
        findFirst: vi.fn().mockResolvedValue({
          id: 12, paymentMethod: 'VNPAY_MOCK', isPaid: true, status: 'CONFIRMED',
        }),
        updateMany: vi.fn(),
      },
    };

    await expect(completeMockPayment(prisma, 7, 12)).resolves.toEqual({
      success: true,
      alreadyCompleted: true,
    });
    expect(prisma.order.updateMany).not.toHaveBeenCalled();
  });
});
