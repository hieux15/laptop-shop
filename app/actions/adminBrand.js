'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function getAdminBrands() {
  await checkAdmin();
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return {
      success: true,
      brands: brands.map(b => ({
        id: b.id,
        name: b.name,
        logo: b.logo,
        productCount: b._count.products
      }))
    };
  } catch (e) {
    console.error('getAdminBrands error:', e);
    return { success: false, brands: [], error: e.message };
  }
}

export async function createBrand(name, logo) {
  await checkAdmin();
  try {
    if (!name || !name.trim()) {
      return { success: false, error: 'Tên hãng không được để trống' };
    }

    // Check duplicate (MySQL uses case-insensitive collation by default)
    const existing = await prisma.brand.findFirst({
      where: { name: { contains: name.trim() } }
    });

    if (existing) {
      return { success: false, error: 'Hãng này đã tồn tại' };
    }

    const brand = await prisma.brand.create({
      data: { 
        name: name.trim(),
        logo: logo?.trim() || null
      }
    });

    return { success: true, brand };
  } catch (e) {
    console.error('createBrand error:', e);
    return { success: false, error: e.message };
  }
}

export async function updateBrand(id, name, logo) {
  await checkAdmin();
  try {
    if (!name || !name.trim()) {
      return { success: false, error: 'Tên hãng không được để trống' };
    }

    // Check duplicate (MySQL uses case-insensitive collation by default)
    const existing = await prisma.brand.findFirst({
      where: { 
        name: { contains: name.trim() },
        id: { not: parseInt(id) }
      }
    });

    if (existing) {
      return { success: false, error: 'Hãng này đã tồn tại' };
    }

    const brand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: { 
        name: name.trim(),
        logo: logo?.trim() || null
      }
    });

    return { success: true, brand };
  } catch (e) {
    console.error('updateBrand error:', e);
    return { success: false, error: e.message };
  }
}

export async function deleteBrand(id) {
  await checkAdmin();
  try {
    // Check if brand has products
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { products: true } } }
    });

    if (!brand) {
      return { success: false, error: 'Không tìm thấy hãng' };
    }

    if (brand._count.products > 0) {
      return { success: false, error: 'Không thể xóa hãng có sản phẩm' };
    }

    await prisma.brand.delete({
      where: { id: parseInt(id) }
    });

    return { success: true };
  } catch (e) {
    console.error('deleteBrand error:', e);
    return { success: false, error: e.message };
  }
}