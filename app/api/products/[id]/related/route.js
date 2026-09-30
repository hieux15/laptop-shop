import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/productUtils';

export const revalidate = 60;
const cacheHeaders = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' };

export async function GET(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      select: { categoryId: true },
    });
    if (!product) return NextResponse.json({ relatedProducts: [] }, { headers: cacheHeaders });

    const relatedProducts = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: id }, isVisible: true },
      select: {
        id: true,
        name: true,
        price: true,
        originalPrice: true,
        specs: true,
        image: true,
        createdAt: true,
        brand: { select: { name: true } },
        category: { select: { name: true } },
        inventory: { select: { quantity: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });

    return NextResponse.json(
      { relatedProducts: relatedProducts.map(serializeProduct) },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error('GET /api/products/[id]/related error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
