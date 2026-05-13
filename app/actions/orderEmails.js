// actions/orderEmails.js - Logic gửi email cho đơn hàng

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import { generateOrderConfirmationEmail, generateStatusUpdateEmail } from '@/lib/orderEmailTemplates';

/**
 * Gửi email xác nhận đặt hàng
 * @param {number} orderId - ID của đơn hàng
 */
export async function sendOrderConfirmationEmail(orderId) {
  try {
    // Query order với user và product details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { fullName: true, email: true }
        },
        orderDetails: {
          include: {
            product: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!order || !order.user?.email) {
      console.error('Order or user email not found:', orderId);
      return;
    }

    const { subject, html, text } = generateOrderConfirmationEmail(
      order,
      order.user.email,
      order.user.fullName || 'Khách hàng'
    );

    await sendEmail({
      to: order.user.email,
      subject,
      html,
      text
    });

    console.log(`✅ Order confirmation email sent for order #${orderId} to ${order.user.email}`);

  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    // Không throw error để không làm gián đoạn flow đặt hàng
  }
}

/**
 * Gửi email cập nhật trạng thái đơn hàng
 * @param {number} orderId - ID của đơn hàng
 * @param {string} newStatus - Trạng thái mới
 * @param {string} oldStatus - Trạng thái cũ (optional)
 */
export async function sendStatusUpdateEmail(orderId, newStatus, oldStatus = null) {
  try {
    // Query order với user info
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { fullName: true, email: true }
        }
      }
    });

    if (!order || !order.user?.email) {
      console.error('Order or user email not found:', orderId);
      return;
    }

    const { subject, html, text } = generateStatusUpdateEmail(
      order,
      order.user.email,
      order.user.fullName || 'Khách hàng',
      oldStatus,
      newStatus
    );

    await sendEmail({
      to: order.user.email,
      subject,
      html,
      text
    });

    console.log(`✅ Status update email sent for order #${orderId} (${newStatus}) to ${order.user.email}`);

  } catch (error) {
    console.error('❌ Failed to send status update email:', error);
    // Không throw error để không làm gián đoạn flow admin
  }
}