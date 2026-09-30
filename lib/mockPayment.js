export async function completeMockPayment(prisma, userId, orderId) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    select: { id: true, paymentMethod: true, isPaid: true, status: true },
  });

  if (!order) return { success: false, reason: 'not_found' };
  if (order.paymentMethod !== 'VNPAY_MOCK') return { success: false, reason: 'wrong_method' };
  if (order.isPaid) return { success: true, alreadyCompleted: true };
  if (order.status !== 'PENDING') return { success: false, reason: 'invalid_status' };

  const result = await prisma.order.updateMany({
    where: {
      id: order.id,
      userId,
      paymentMethod: 'VNPAY_MOCK',
      isPaid: false,
      status: 'PENDING',
    },
    data: { isPaid: true, status: 'CONFIRMED' },
  });

  if (result.count === 1) return { success: true, alreadyCompleted: false };

  // Concurrent retries are successful only if the same mock order is now paid.
  const latestOrder = await prisma.order.findFirst({
    where: { id: order.id, userId },
    select: { paymentMethod: true, isPaid: true },
  });
  if (latestOrder?.paymentMethod === 'VNPAY_MOCK' && latestOrder.isPaid) {
    return { success: true, alreadyCompleted: true };
  }

  return { success: false, reason: 'invalid_status' };
}
