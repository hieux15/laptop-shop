import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serializeProduct } from '@/lib/productUtils';

export async function GET(request, { params }) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { brand: true, category: true, inventory: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: id },
        isVisible: true,
      },
      include: { brand: true, category: true },
      take: 4,
    });

    return NextResponse.json({
      product: serializeProduct(product),
      relatedProducts: relatedProducts.map(serializeProduct),
    });
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
