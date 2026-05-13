// lib/orderEmailTemplates.js - Templates đơn giản cho email đơn hàng

const BRAND_COLORS = {
  primary: '#3B82F6',    // blue-500
  secondary: '#F59E0B',  // yellow-500
  success: '#10B981',    // green-500
  danger: '#EF4444',     // red-500
  gray: '#6B7280'        // gray-500
};

export function generateOrderConfirmationEmail(order, userEmail, userName) {
  const subject = `Đặt hàng thành công - Mã đơn #${order.id}`;

  const productsHtml = order.orderDetails.map(detail =>
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
        ${detail.product.name}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${detail.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${detail.price.toLocaleString('vi-VN')} ₫
      </td>
    </tr>`
  ).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary}); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">LapPro VN</h1>
        <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Đặt hàng thành công!</p>
      </div>

      <!-- Content -->
      <div style="padding: 24px;">
        <h2 style="color: ${BRAND_COLORS.primary}; margin-top: 0;">Xin chào ${userName}!</h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">
          Cảm ơn bạn đã đặt hàng tại LapPro VN. Đơn hàng của bạn đã được ghi nhận thành công.
        </p>

        <!-- Order Info -->
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px; color: ${BRAND_COLORS.primary};">Thông tin đơn hàng</h3>
          <p style="margin: 4px 0;"><strong>Mã đơn hàng:</strong> #${order.id}</p>
          <p style="margin: 4px 0;"><strong>Ngày đặt:</strong> ${new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
          <p style="margin: 4px 0;"><strong>Trạng thái:</strong> ${getStatusText(order.status)}</p>
        </div>

        <!-- Products -->
        <h3 style="color: ${BRAND_COLORS.primary}; margin-bottom: 12px;">Chi tiết sản phẩm</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Sản phẩm</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb; font-weight: 600;">SL</th>
              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb; font-weight: 600;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${productsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f9fafb; font-weight: 600;">
              <td colspan="2" style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb;">Tổng cộng:</td>
              <td style="padding: 12px; text-align: right; border-top: 2px solid #e5e7eb; color: ${BRAND_COLORS.primary};">
                ${order.total.toLocaleString('vi-VN')} ₫
              </td>
            </tr>
          </tfoot>
        </table>

        <!-- Shipping Info -->
        <h3 style="color: ${BRAND_COLORS.primary}; margin-bottom: 12px;">Thông tin giao hàng</h3>
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px;">
          <p style="margin: 4px 0;"><strong>Người nhận:</strong> ${order.receiverName}</p>
          <p style="margin: 4px 0;"><strong>SĐT:</strong> ${order.receiverPhone}</p>
          <p style="margin: 4px 0;"><strong>Địa chỉ:</strong> ${order.street}, ${order.city}, ${order.province}</p>
          <p style="margin: 4px 0;"><strong>Thanh toán:</strong> ${order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán'}</p>
        </div>

        <p style="margin-top: 24px; line-height: 1.6; color: ${BRAND_COLORS.gray};">
          Chúng tôi sẽ xử lý đơn hàng trong vòng 1-2 ngày làm việc. Bạn sẽ nhận được email cập nhật khi đơn hàng được giao.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.gray};">
          Cảm ơn bạn đã tin tưởng LapPro VN!<br>
          Hotline: 1900 XXX XXX | Email: support@lappro.vn
        </p>
      </div>
    </div>
  `;

  const text = `
    Xin chào ${userName}!

    Cảm ơn bạn đã đặt hàng tại LapPro VN.

    Mã đơn hàng: #${order.id}
    Trạng thái: ${getStatusText(order.status)}
    Tổng tiền: ${order.total.toLocaleString('vi-VN')} ₫

    Thông tin giao hàng:
    Người nhận: ${order.receiverName}
    SĐT: ${order.receiverPhone}
    Địa chỉ: ${order.street}, ${order.city}, ${order.province}

    Hotline: 1900 XXX XXX
    Email: support@lappro.vn
  `;

  return { subject, html, text };
}

export function generateStatusUpdateEmail(order, userEmail, userName, oldStatus, newStatus) {
  const subject = `Cập nhật đơn hàng #${order.id} - ${getStatusText(newStatus)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, ${BRAND_COLORS.primary}, ${BRAND_COLORS.secondary}); color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">LapPro VN</h1>
        <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Cập nhật trạng thái đơn hàng</p>
      </div>

      <!-- Content -->
      <div style="padding: 24px;">
        <h2 style="color: ${BRAND_COLORS.primary}; margin-top: 0;">Xin chào ${userName}!</h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">
          Đơn hàng #${order.id} của bạn đã được cập nhật trạng thái.
        </p>

        <!-- Status Update -->
        <div style="background: ${getStatusColor(newStatus)}; padding: 16px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
          <h3 style="margin: 0; color: white; font-size: 18px;">${getStatusText(newStatus)}</h3>
        </div>

        <p style="line-height: 1.6; color: ${BRAND_COLORS.gray};">
          ${getStatusMessage(newStatus)}
        </p>

        <div style="text-align: center; margin-top: 24px;">
          <a href="${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/orders"
             style="background: ${BRAND_COLORS.primary}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Xem đơn hàng
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.gray};">
          Cảm ơn bạn đã tin tưởng LapPro VN!<br>
          Hotline: 1900 XXX XXX | Email: support@lappro.vn
        </p>
      </div>
    </div>
  `;

  const text = `
    Xin chào ${userName}!

    Đơn hàng #${order.id} của bạn đã được cập nhật:

    Trạng thái mới: ${getStatusText(newStatus)}

    ${getStatusMessage(newStatus)}

    Xem chi tiết: ${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/orders

    Hotline: 1900 XXX XXX
    Email: support@lappro.vn
  `;

  return { subject, html, text };
}

// Helper functions
function getStatusText(status) {
  switch (status) {
    case 'PENDING': return 'Chờ xử lý';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'SHIPPING': return 'Đang giao hàng';
    case 'DELIVERED': return 'Đã giao thành công';
    case 'CANCELLED': return 'Đã hủy';
    default: return status;
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'PENDING': return '#6B7280'; // gray
    case 'CONFIRMED': return '#3B82F6'; // blue
    case 'SHIPPING': return '#F59E0B'; // yellow
    case 'DELIVERED': return '#10B981'; // green
    case 'CANCELLED': return '#EF4444'; // red
    default: return '#6B7280';
  }
}

function getStatusMessage(status) {
  switch (status) {
    case 'CONFIRMED':
      return 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị để giao hàng.';
    case 'SHIPPING':
      return 'Đơn hàng của bạn đang được vận chuyển. Bạn sẽ nhận được hàng trong vài ngày tới.';
    case 'DELIVERED':
      return 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng!';
    case 'CANCELLED':
      return 'Đơn hàng của bạn đã được hủy. Vui lòng liên hệ hotline để được hỗ trợ.';
    default:
      return 'Trạng thái đơn hàng đã được cập nhật.';
  }
}