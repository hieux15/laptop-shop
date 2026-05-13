import { describe, it, expect } from 'vitest';
import { serializeProduct } from '@/lib/productUtils';

describe('lib/productUtils', () => {
  it('serializeProduct: computes average rating and rounds to 1 decimal', () => {
    const p = {
      id: 1,
      name: 'Test Laptop',
      price: '20000000',
      originalPrice: null,
      image: null,
      description: null,
      specs: null,
      brand: { name: 'Dell' },
      category: { name: 'Laptop Văn Phòng' },
      inventory: { quantity: 5 },
      reviews: [{ rating: 5 }, { rating: 4 }, { rating: 4 }],
    };

    const s = serializeProduct(p);
    expect(s.rating).toBe(4.3);
    expect(s.reviewCount).toBe(3);
  });

  it('serializeProduct: falls back to defaults when optional fields missing', () => {
    const p = {
      id: 2,
      name: 'No Optional',
      price: 123,
      originalPrice: undefined,
      brand: undefined,
      category: undefined,
      inventory: undefined,
      reviews: undefined,
    };

    const s = serializeProduct(p);
    expect(s.image).toBe('/laptop-office.jpg');
    expect(s.description).toBe('');
    expect(s.specs).toEqual({});
    expect(s.brand).toBe('');
    expect(s.category).toBe('');
    expect(s.stock).toBeNull();
    expect(s.rating).toBe(0);
    expect(s.reviewCount).toBe(0);
  });

  it('serializeProduct: slugifies Vietnamese category name (đ, dấu, spaces)', () => {
    const p = {
      id: 3,
      name: 'X',
      price: 1,
      brand: { name: 'B' },
      category: { name: 'Laptop Đồ Họa' },
      reviews: [],
    };

    const s = serializeProduct(p);
    expect(s.category).toBe('laptop-do-hoa');
    expect(s.categoryName).toBe('Laptop Đồ Họa');
  });
});
