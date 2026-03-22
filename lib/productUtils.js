function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function serializeProduct(p) {
  // Tính rating trung bình từ reviews
  const reviewCount = p.reviews?.length ?? 0;
  const rating = reviewCount > 0
    ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0;

  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    image: p.image || '/laptop-office.jpg',
    description: p.description || '',
    specs: p.specs || {},
    brand: p.brand?.name || '',
    category: toSlug(p.category?.name || ''),
    categoryName: p.category?.name || '',
    stock: p.inventory?.quantity ?? null,
    rating: Math.round(rating * 10) / 10,
    reviewCount,
  };
}