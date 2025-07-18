import { Order, Warehouse, OrderItem } from "../config/associations";
import { OrderItemAttributes } from "./order-item.model";
import Product from "../product/product.model";

class OrderItemService {
  async getAllOrderItems(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orderItems: OrderItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await OrderItem.findAndCountAll({
      where: {
        deletedAt: null,
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "code", "type", "price"],
        },
      ],
    });

    return {
      orderItems: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getOrderItemById(id: string): Promise<OrderItem | null> {
    return await OrderItem.findByPk(id);
  }

  async createOrderItem(orderItemData: {
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    modifiedBy?: string;
  }): Promise<OrderItem> {
    const compatibilityCheck = await this.validateProductWarehouseCompatibility(
      orderItemData.productId,
      orderItemData.orderId
    );

    if (!compatibilityCheck.isValid) {
      throw new Error(
        compatibilityCheck.error ||
          "Product-warehouse compatibility validation failed"
      );
    }

    return await OrderItem.create({
      ...orderItemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateOrderItem(
    id: string,
    updateData: Partial<OrderItemAttributes>
  ): Promise<OrderItem | null> {
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return null;
    }

    if (
      updateData.productId &&
      updateData.productId !== (orderItem as any).productId
    ) {
      const compatibilityCheck =
        await this.validateProductWarehouseCompatibility(
          updateData.productId,
          (orderItem as any).orderId
        );

      if (!compatibilityCheck.isValid) {
        throw new Error(
          compatibilityCheck.error ||
            "Product-warehouse compatibility validation failed"
        );
      }
    }

    await orderItem.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return orderItem;
  }

  async deleteOrderItem(id: string): Promise<boolean> {
    const orderItem = await OrderItem.findByPk(id);
    if (!orderItem) {
      return false;
    }

    await orderItem.update({
      deletedAt: new Date(),
    });

    return true;
  }

  async getOrderItemsByOrder(orderId: string): Promise<OrderItem[]> {
    return await OrderItem.findAll({
      where: {
        orderId,
        deletedAt: null,
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "code", "type", "price"],
        },
      ],
    });
  }

  async validateProductWarehouseCompatibility(
    productId: string,
    orderId: string
  ): Promise<{ isValid: boolean; error?: string }> {
    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: Warehouse,
            as: "warehouse",
            attributes: ["id", "name", "type"],
          },
        ],
      });

      if (!order) {
        return { isValid: false, error: "Order not found" };
      }

      const product = await Product.findByPk(productId);

      if (!product) {
        return { isValid: false, error: "Product not found" };
      }
      const warehouse = (order as any).warehouse;

      if (!warehouse) {
        return {
          isValid: false,
          error: "Warehouse information not found for this order",
        };
      }

      if (warehouse.type && (product as any).type !== warehouse.type) {
        return {
          isValid: false,
          error: `Product '${(product as any).name}' (type: ${(product as any).type}) is not compatible with warehouse '${warehouse.name}' (type: ${warehouse.type}). Solid products can only be stored in solid warehouses, and liquid products can only be stored in liquid warehouses.`,
        };
      }

      return { isValid: true };
    } catch (error) {
      console.error("Error validating product-warehouse compatibility:", error);
      return { isValid: false, error: "Validation error occurred" };
    }
  }
}

export default new OrderItemService();
