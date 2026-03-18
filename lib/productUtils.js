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
  };
}
