'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

const NEWSLETTER_VOUCHER_CODE = 'WELCOME10';

async function getOrCreateNewsletterVoucher() {
  let voucher = await prisma.voucher.findUnique({
    where: { code: NEWSLETTER_VOUCHER_CODE },
  });
  
  if (!voucher) {
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    
    voucher = await prisma.voucher.create({
      data: {
        code: NEWSLETTER_VOUCHER_CODE,
        discount: 15,
        maxDiscount: 300000,
        minOrder: 500000,
        usageLimit: 1000,
        isActive: true,
        expiredAt: thirtyDaysLater,
      },
    });
  }
  
  return voucher;
}

async function sendNewsletterVoucherEmail(email, voucher) {
  const subject = 'Chào mừng bạn đến với Laptop Shop - Mã giảm giá của bạn!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Xin chào!</h2>
      <p style="color: #666;">Cảm ơn bạn đã đăng ký nhận tin tại Laptop Shop!</p>
      <p style="color: #666;">Dưới đây là mã giảm giá dành riêng cho bạn:</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <p style="margin: 0 0 10px; color: #666;">Mã giảm giá:</p>
        <h3 style="color: #e74c3c; margin: 0; font-size: 28px;">${voucher.code}</h3>
      </div>
      <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #2e7d32;"><strong>Giảm giá:</strong> ${voucher.discount}%</p>
        <p style="margin: 5px 0 0; color: #2e7d32;"><strong>Tối đa:</strong> ${voucher.maxDiscount?.toLocaleString('vi-VN')} VND</p>
        <p style="margin: 5px 0 0; color: #2e7d32;"><strong>Đơn tối thiểu:</strong> ${voucher.minOrder.toLocaleString('vi-VN')} VND</p>
      </div>
      ${voucher.expiredAt ? `<p style="color: #999; font-size: 12px;">Có hiệu lực đến: ${new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}</p>` : ''}
      <p style="color: #666;">Hẹn gặp lại bạn tại Laptop Shop!</p>
    </div>
  `;
  const text = `Xin chào!\n\nCảm ơn bạn đã đăng ký nhận tin tại Laptop Shop!\n\nMã giảm giá của bạn: ${voucher.code}\nGiảm giá: ${voucher.discount}%\nTối đa: ${voucher.maxDiscount?.toLocaleString('vi-VN')} VND\nĐơn tối thiểu: ${voucher.minOrder.toLocaleString('vi-VN')} VND\n${voucher.expiredAt ? `Có hiệu lực đến: ${new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}` : ''}\n\nHẹn gặp lại bạn tại Laptop Shop!`;

  await sendEmail({ to: email, subject, html, text });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeNewsletterAction(email) {
  const trimmed = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!trimmed) {
    return { success: false, error: 'Vui lòng nhập email' };
  }
  if (!EMAIL_RE.test(trimmed)) {
    return { success: false, error: 'Email không hợp lệ' };
  }

  try {
    const voucher = await getOrCreateNewsletterVoucher();
    await sendNewsletterVoucherEmail(trimmed, voucher);

    return { success: true };
  } catch (e) {
    console.error('subscribeNewsletterAction:', e);
    return {
      success: false,
      error: 'Đăng ký thất bại, vui lòng thử lại',
    };
  }
}
