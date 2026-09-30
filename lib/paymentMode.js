export const PAYMENT_MODE = Object.freeze({
  MOCK: 'mock',
  VNPAY: 'vnpay',
});

export function getPaymentMode(env = process.env) {
  const configuredMode = env.PAYMENT_MODE?.trim().toLowerCase();
  if (configuredMode === PAYMENT_MODE.MOCK || configuredMode === PAYMENT_MODE.VNPAY) {
    return configuredMode;
  }

  return env.NODE_ENV === 'development' ? PAYMENT_MODE.MOCK : PAYMENT_MODE.VNPAY;
}
