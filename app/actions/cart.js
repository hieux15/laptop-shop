'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCartAction() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'User not authenticated', items: [] };
  }

  try {
    const userId = parseInt(session.user.id);

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                originalPrice: true,
              }
            }
          }
        }
      }
    });

    if (!cart) {
      return { success: true, items: [] };
    }

    // Transform database structure to match client's cart format
    const transformedItems = cart.items.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      image: item.product.image,
      originalPrice: item.product.originalPrice ? Number(item.product.originalPrice) : null,
      quantity: item.quantity,
    }));

    return { success: true, items: transformedItems };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return { success: false, error: 'Failed to fetch cart', items: [] };
  }
}

export async function addToCartAction(productId, quantity = 1) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  try {
    const userId = parseInt(session.user.id);
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId } });

    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId }
    });
    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity }
      });
    } else {
      await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity }
      });
    }
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function updateCartAction(productId, quantity) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  try {
    const userId = parseInt(session.user.id);
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };
    await prisma.cartItem.updateMany({
      where: { cartId: cart.id, productId },
      data: { quantity }
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function removeFromCartAction(productId) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  try {
    const userId = parseInt(session.user.id);
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id, productId }
    });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function clearCartAction() {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  try {
    const userId = parseInt(session.user.id);
    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) return { success: false };
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}