import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      productCount: c._count.products
    })));
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}