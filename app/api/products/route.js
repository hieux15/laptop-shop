import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/productUtils';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isVisible: true },
      include: { brand: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
