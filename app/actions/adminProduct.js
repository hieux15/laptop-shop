'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminProducts() {
  await checkAdmin();  
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        inventory: { select: { quantity: true } },
        _count: { select: { orderDetails: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        image: p.image || '/laptop-office.jpg',
        description: p.description || '',
        specs: p.specs || {},
        brandId: p.brandId,
        brand: p.brand?.name || '',
        categoryId: p.categoryId,
        category: p.category?.name || '',
        stock: p.inventory?.quantity ?? 0,
        isVisible: p.isVisible,
        orderCount: p._count.orderDetails,
        createdAt: p.createdAt.toISOString(),
      }))
    };
  } catch (e) {
    console.error('getAdminProducts error:', e);
    return { success: false, products: [], error: e.message };
  }
}

export async function getCategories() {
  await checkAdmin();
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    return { success: true, categories };
  } catch (e) {
    return { success: false, categories: [] };
  }
}

export async function getBrands() {
  await checkAdmin();
  try {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    return { success: true, brands };
  } catch (e) {
    return { success: false, brands: [] };
  }
}

export async function createProduct(data) {
  await checkAdmin();
  try {
    const {
      name, brandId, categoryId, price, originalPrice,
      description, specs, image, isVisible, stock
    } = data;

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: name.trim(),
          brandId: parseInt(brandId),
          categoryId: parseInt(categoryId),
          price: parseInt(price),
          originalPrice: originalPrice ? parseInt(originalPrice) : null,
          description: description?.trim() || null,
          specs: specs || {},
          image: image?.trim() || null,
          isVisible: isVisible !== false,
        },
      });

      await tx.inventory.create({
        data: {
          productId: newProduct.id,
          quantity: parseInt(stock) || 0,
        },
      });

      return newProduct;
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, productId: product.id };
  } catch (e) {
    console.error('createProduct error:', e);
    return { success: false, error: 'Thêm sản phẩm thất bại: ' + e.message };
  }
}

export async function updateProduct(id, data) {
  await checkAdmin();
  try {
    const {
      name, brandId, categoryId, price, originalPrice,
      description, specs, image, isVisible,
    } = data;

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        brandId: parseInt(brandId),
        categoryId: parseInt(categoryId),
        price: parseInt(price),
        originalPrice: originalPrice ? parseInt(originalPrice) : null,
        description: description?.trim() || null,
        specs: specs || {},
        image: image?.trim() || null,
        isVisible: isVisible !== false,
      },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true };
  } catch (e) {
    console.error('updateProduct error:', e);
    return { success: false, error: 'Cập nhật sản phẩm thất bại: ' + e.message };
  }
}

export async function deleteProduct(id) {
  await checkAdmin();
  try {
    const productId = parseInt(id);

    // Kiểm tra xem có đơn hàng nào liên quan không
    const orderDetailCount = await prisma.orderDetail.count({
      where: { productId }
    });

    if (orderDetailCount > 0) {
      return {
        success: false,
        error: `Không thể xóa vì sản phẩm đã có trong ${orderDetailCount} đơn hàng. Hãy ẩn sản phẩm thay vì xóa.`
      };
    }

    await prisma.$transaction(async (tx) => {
      // Xóa các CartItem liên quan
      await tx.cartItem.deleteMany({ where: { productId } });
      // Xóa Inventory
      await tx.inventory.deleteMany({ where: { productId } });
      // Xóa Review
      await tx.review.deleteMany({ where: { productId } });
      // Xóa sản phẩm
      await tx.product.delete({ where: { id: productId } });
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true };
  } catch (e) {
    console.error('deleteProduct error:', e);
    return { success: false, error: 'Xóa sản phẩm thất bại: ' + e.message };
  }
}

export async function toggleProductVisibility(id, isVisible) {
  await checkAdmin();
  try {
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isVisible },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true };
  } catch (e) {
    console.error('toggleProductVisibility error:', e);
    return { success: false, error: 'Cập nhật trạng thái thất bại' };
  }
}
