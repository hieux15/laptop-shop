import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(brands.map(b => ({
      id: b.id,
      name: b.name,
      logo: b.logo,
      productCount: b._count.products
    })));
  } catch (error) {
    console.error('GET /api/brands error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}