'use server';

import { prisma } from '@/lib/prisma';

// Get all inventory with product details
export async function getInventoryList() {
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get total sold for each product
    const orderDetails = await prisma.orderDetail.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
    });

    const soldMap = {};
    orderDetails.forEach((item) => {
      soldMap[item.productId] = item._sum.quantity || 0;
    });

    // Format the data
    const formattedInventories = inventories.map((inv) => ({
      id: inv.id,
      productId: inv.productId,
      productName: inv.product.name,
      productImage: inv.product.image,
      brand: inv.product.brand.name,
      category: inv.product.category.name,
      quantity: inv.quantity,
      sold: soldMap[inv.productId] || 0,
      price: Number(inv.product.price),
      stockValue: Number(inv.product.price) * inv.quantity,
      lastUpdated: inv.updatedAt.toISOString(),
    }));

    return {
      success: true,
      inventories: formattedInventories,
    };
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return {
      success: false,
      error: 'Lỗi khi tải danh sách kho hàng',
    };
  }
}

// Get low stock products (less than threshold)
export async function getLowStockProducts(threshold = 5) {
  try {
    const lowStockProducts = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: threshold,
        },
      },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
      orderBy: {
        quantity: 'asc',
      },
    });

    const formattedProducts = lowStockProducts.map((inv) => ({
      id: inv.id,
      productId: inv.productId,
      productName: inv.product.name,
      productImage: inv.product.image,
      brand: inv.product.brand.name,
      category: inv.product.category.name,
      quantity: inv.quantity,
      price: Number(inv.product.price),
    }));

    return {
      success: true,
      products: formattedProducts,
    };
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return {
      success: false,
      error: 'Lỗi khi tải sản phẩm sắp hết hàng',
    };
  }
}

// Get inventory statistics
export async function getInventoryStats() {
  try {
    const [totalProducts, lowStockCount, outOfStockCount, inventories] =
      await Promise.all([
        prisma.inventory.count(),
        prisma.inventory.count({
          where: {
            quantity: {
              gt: 0,
              lte: 5,
            },
          },
        }),
        prisma.inventory.count({
          where: {
            quantity: 0,
          },
        }),
        prisma.inventory.findMany({
          include: {
            product: true,
          },
        }),
      ]);

    // Calculate total stock value
    const totalStockValue = inventories.reduce((sum, inv) => {
      return sum + Number(inv.product.price) * inv.quantity;
    }, 0);

    return {
      success: true,
      stats: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalStockValue,
        inStockCount: totalProducts - outOfStockCount,
      },
    };
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    return {
      success: false,
      error: 'Lỗi khi tải thống kê kho hàng',
    };
  }
}

// Update inventory quantity
export async function updateInventoryQuantity(inventoryId, quantity, reason = '') {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { product: true },
    });

    if (!inventory) {
      return {
        success: false,
        error: 'Không tìm thấy thông tin kho hàng',
      };
    }

    if (quantity < 0) {
      return {
        success: false,
        error: 'Số lượng không thể âm',
      };
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
    });

    return {
      success: true,
      inventory: {
        id: updatedInventory.id,
        productId: updatedInventory.productId,
        quantity: updatedInventory.quantity,
      },
      message: 'Cập nhật kho hàng thành công',
    };
  } catch (error) {
    console.error('Error updating inventory:', error);
    return {
      success: false,
      error: 'Lỗi khi cập nhật kho hàng',
    };
  }
}

// Bulk update inventory quantities
export async function bulkUpdateInventoryQuantity(updates) {
  try {
    const results = [];

    for (const update of updates) {
      const result = await prisma.inventory.update({
        where: { id: update.inventoryId },
        data: {
          quantity: update.quantity,
        },
      });
      results.push({
        inventoryId: update.inventoryId,
        success: true,
        newQuantity: result.quantity,
      });
    }

    return {
      success: true,
      results,
      message: 'Cập nhật hàng loạt thành công',
    };
  } catch (error) {
    console.error('Error bulk updating inventory:', error);
    return {
      success: false,
      error: 'Lỗi khi cập nhật hàng loạt',
    };
  }
}

// Adjust inventory (add or subtract)
export async function adjustInventoryQuantity(inventoryId, adjustment, reason = '') {
  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory) {
      return {
        success: false,
        error: 'Không tìm thấy thông tin kho hàng',
      };
    }

    const newQuantity = inventory.quantity + adjustment;

    if (newQuantity < 0) {
      return {
        success: false,
        error: 'Số lượng sau điều chỉnh không thể âm',
      };
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id: inventoryId },
      data: {
        quantity: newQuantity,
      },
      include: {
        product: {
          include: {
            category: true,
            brand: true,
          },
        },
      },
    });

    return {
      success: true,
      inventory: {
        id: updatedInventory.id,
        productId: updatedInventory.productId,
        quantity: updatedInventory.quantity,
      },
      message: 'Điều chỉnh kho hàng thành công',
    };
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return {
      success: false,
      error: 'Lỗi khi điều chỉnh kho hàng',
    };
  }
}