'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminCategories() {
  await checkAdmin();
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return {
      success: true,
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        productCount: c._count.products
      }))
    };
  } catch (e) {
    console.error('getAdminCategories error:', e);
    return { success: false, categories: [], error: e.message };
  }
}

export async function createCategory(name) {
  await checkAdmin();
  try {
    if (!name || !name.trim()) {
      return { success: false, error: 'Tên danh mục không được để trống' };
    }

    // Check duplicate (MySQL uses case-insensitive collation by default)
    const existing = await prisma.category.findFirst({
      where: { name: { contains: name.trim() } }
    });

    if (existing) {
      return { success: false, error: 'Danh mục này đã tồn tại' };
    }

    const category = await prisma.category.create({
      data: { name: name.trim() }
    });

    return { success: true, category };
  } catch (e) {
    console.error('createCategory error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateCategory(id, name) {
  await checkAdmin();
  try {
    if (!name || !name.trim()) {
      return { success: false, error: 'Tên danh mục không được để trống' };
    }

    // Check duplicate (MySQL uses case-insensitive collation by default)
    const existing = await prisma.category.findFirst({
      where: { 
        name: { contains: name.trim() },
        id: { not: parseInt(id) }
      }
    });

    if (existing) {
      return { success: false, error: 'Danh mục này đã tồn tại' };
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name: name.trim() }
    });

    return { success: true, category };
  } catch (e) {
    console.error('updateCategory error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteCategory(id) {
  await checkAdmin();
  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } }
    });

    if (!category) {
      return { success: false, error: 'Không tìm thấy danh mục' };
    }

    if (category._count.products > 0) {
      return { success: false, error: 'Không thể xóa danh mục có sản phẩm' };
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    return { success: true };
  } catch (e) {
    console.error('deleteCategory error:', e);
    return { success: false, error: e.message };
  }
}