import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/productUtils';

export const revalidate = 60;

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isVisible: true },
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
        reviews: { select: { rating: true } },
        inventory: { select: { quantity: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
