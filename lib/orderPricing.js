/** Phí ship / ngưỡng miễn ship — khớp checkout & cart */
export const FREE_SHIP_THRESHOLD = 20_000_000;
export const SHIPPING_FEE = 30_000;

export function normalizeVoucherCode(code) {
  if (code == null || typeof code !== 'string') return '';
  return code.trim().toUpperCase();
}

export function computeShipping(subtotal) {
  const s = Math.floor(Number(subtotal) || 0);
  return s >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE;
}

/**
 * @param {number} subtotal
 * @param {{ discount: number; maxDiscount: number | null }} voucher
 */
export function computeDiscountAmount(subtotal, voucher) {
  if (!voucher || subtotal <= 0) return 0;
  const pct = Math.max(0, Math.min(100, Number(voucher.discount) || 0));
  let raw = Math.floor((subtotal * pct) / 100);
  if (voucher.maxDiscount != null) {
    raw = Math.min(raw, voucher.maxDiscount);
  }
  return Math.min(raw, subtotal);
}

export function computeOrderTotal(subtotal, shipping, discountAmount) {
  const t = Math.floor(Number(subtotal) || 0) + Math.floor(Number(shipping) || 0) - Math.floor(Number(discountAmount) || 0);
  return Math.max(0, t);
}
