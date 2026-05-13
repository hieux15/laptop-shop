import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sortObject } from '@/lib/vnpay';

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Thiếu orderId' }, { status: 400 });
    }

    // Lấy thông tin đơn hàng từ DB
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    // Các tham số VNPay
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURNURL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      return NextResponse.json({ success: false, error: 'Thiếu cấu hình VNPay' }, { status: 500 });
    }

    // Đảm bảo lấy đúng múi giờ chuẩn GMT+7 Việt Nam
    const vnTime = new Date(Date.now() + 7 * 60 * 60 * 1000); // UTC +7
    const createDate = vnTime.getUTCFullYear().toString() +
      ('0' + (vnTime.getUTCMonth() + 1)).slice(-2) +
      ('0' + vnTime.getUTCDate()).slice(-2) +
      ('0' + vnTime.getUTCHours()).slice(-2) +
      ('0' + vnTime.getUTCMinutes()).slice(-2) +
      ('0' + vnTime.getUTCSeconds()).slice(-2);
    
    // Cộng 15 phút tính từ giờ tạo
    const expireDateObj = new Date(vnTime.getTime() + 15 * 60 * 1000); 
    const expireDate = expireDateObj.getUTCFullYear().toString() +
      ('0' + (expireDateObj.getUTCMonth() + 1)).slice(-2) +
      ('0' + expireDateObj.getUTCDate()).slice(-2) +
      ('0' + expireDateObj.getUTCHours()).slice(-2) +
      ('0' + expireDateObj.getUTCMinutes()).slice(-2) +
      ('0' + expireDateObj.getUTCSeconds()).slice(-2);

    let ipAddr = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 '127.0.0.1';
    
    // Đảm bảo ipAddr là chuỗi IP không dấu phẩy
    if (ipAddr) {
      ipAddr = ipAddr.split(',')[0].trim();
    }
    if (!ipAddr || ipAddr === '::1') {
      ipAddr = '127.0.0.1';
    }

    const amount = Math.round(Number(order.total) * 100); // Đảm bảo là nguyên số dương
    const bankCode = 'NCB'; // Cố định NCB cho nhánh này
    
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = order.id.toString();
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + order.id;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDate;
    vnp_Params['vnp_BankCode'] = bankCode;

    vnp_Params = sortObject(vnp_Params);

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
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = vnpUrl + '?' + signData + '&vnp_SecureHash=' + signed;

    return NextResponse.json({ success: true, paymentUrl });

  } catch (error) {
    console.error('Lỗi khi tạo VNPay URL:', error);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống khi tạo link thanh toán' }, { status: 500 });
  }
}
