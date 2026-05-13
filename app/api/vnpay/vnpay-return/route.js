import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sortObject } from '@/lib/vnpay';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  let vnp_Params = {};
  for (const [key, value] of searchParams.entries()) {
    vnp_Params[key] = value;
  }

  const secureHash = vnp_Params['vnp_SecureHash'];
  
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASHSECRET;

  let signData = "";
  let i = 0;
  for (let key in vnp_Params) {
      if (vnp_Params.hasOwnProperty(key)) {
          if (i > 0) signData += '&';
          signData += key + '=' + vnp_Params[key];
          i++;
      }
  }
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

  const orderId = vnp_Params['vnp_TxnRef'];
  const responseCode = vnp_Params['vnp_ResponseCode'];

  let redirectUrl = new URL(`/checkout/result`, request.url);
  redirectUrl.searchParams.set('orderId', orderId);

  // Kiểm tra checksum
  if (secureHash === signed) {
    if (responseCode === "00") {
      // Thanh toán thành công
      try {
        await prisma.order.update({
          where: { id: parseInt(orderId) },
          data: {
            isPaid: true,
            status: 'CONFIRMED' // Cập nhật sang CONFIRMED khi thanh toán thành công
          }
        });
        redirectUrl.searchParams.set('status', 'success');
      } catch (error) {
        console.error('Lỗi cập nhật DB order:', error);
        redirectUrl.searchParams.set('status', 'db_error');
      }
    } else {
      // Giao dịch không thành công
      redirectUrl.searchParams.set('status', 'failed');
      redirectUrl.searchParams.set('vnp_ResponseCode', responseCode);
    }
  } else {
    // Chữ ký không hợp lệ
    redirectUrl.searchParams.set('status', 'invalid_signature');
  }

  return NextResponse.redirect(redirectUrl);
}
