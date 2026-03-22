'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function createOrderAction(orderData) {
  const session = await auth();
  const userId = session?.user?.id ? parseInt(session.user.id) : null;

  try {
    const { receiverName, receiverPhone, street, city, province, paymentMethod, note, items } = orderData;

    const productIds = items.map(i => i.id);

    // Lấy sản phẩm + tồn kho cùng lúc
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        price: true,
        name: true,
        inventory: { select: { quantity: true } }
      }
    });

    // Kiểm tra tồn kho từng sản phẩm
    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      const stock = product?.inventory?.quantity ?? 0;
      if (stock < item.quantity) {
        return {
          success: false,
          error: `"${product.name}" chỉ còn ${stock} sản phẩm trong kho`
        };
      }
    }

    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + Number(product.price) * item.quantity;
    }, 0);

    // Dùng transaction để đảm bảo toàn vẹn dữ liệu
    const order = await prisma.$transaction(async (tx) => {
      // Tạo order
      const newOrder = await tx.order.create({
        data: {
          userId,
          receiverName,
          receiverPhone,
          street,
          city,
          province,
          paymentMethod,
          note: note || null,
          total,
          orderDetails: {
            create: items.map(item => {
              const product = products.find(p => p.id === item.id);
              return {
                productId: item.id,
                quantity: item.quantity,
                price: Number(product.price),
              };
            })
          }
        }
      });

      // Trừ tồn kho từng sản phẩm
      for (const item of items) {
        await tx.inventory.updateMany({
          where: { productId: item.id },
          data: { quantity: { decrement: item.quantity } }
        });
      }

      // Xóa giỏ hàng (chỉ khi đã đăng nhập)
      if (userId) {
        const cart = await tx.cart.findUnique({ where: { userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return newOrder;
    });

    return { success: true, orderId: order.id };
  } catch (e) {
    console.error('Error creating order:', e);
    return { success: false, error: 'Đặt hàng thất bại' };
  }
}

export async function getOrdersAction() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, orders: [] };
  try {
    const userId = parseInt(session.user.id);
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderDetails: {
          include: {
            product: { select: { id: true, name: true, image: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return {
      success: true,
      orders: orders.map(o => ({
        ...o,
        total: Number(o.total),
        orderDetails: o.orderDetails.map(d => ({ ...d, price: Number(d.price) }))
      }))
    };
  } catch (e) {
    console.error(e);
    return { success: false, orders: [] };
  }
}

export async function cancelOrderAction(orderId) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'Chưa đăng nhập' };
  try {
    const userId = parseInt(session.user.id);
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    });
    if (!order) return { success: false, error: 'Không tìm thấy đơn hàng' };
    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return { success: false, error: 'Không thể hủy đơn ở trạng thái này' };
    }
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Hủy đơn thất bại' };
  }
}

export async function getOrderDetailAction(orderId) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, order: null };
  try {
    const userId = parseInt(session.user.id);
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderDetails: {
          include: {
            product: { select: { id: true, name: true, image: true } }
          }
        }
      }
    });
    if (!order) return { success: false, order: null };
    return {
      success: true,
      order: {
        ...order,
        total: Number(order.total),
        orderDetails: order.orderDetails.map(d => ({ ...d, price: Number(d.price) }))
      }
    };
  } catch (e) {
    console.error(e);
    return { success: false, order: null };
  }
}

export async function getLastOrderAddressAction() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  try {
    const userId = parseInt(session.user.id);
    const lastOrder = await prisma.order.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        receiverName: true,
        receiverPhone: true,
        street: true,
        city: true,
        province: true,
      }
    });
    if (!lastOrder) return { success: false };
    return { success: true, address: lastOrder };
  } catch (e) {
    return { success: false };
  }
}