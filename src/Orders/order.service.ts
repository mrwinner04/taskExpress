import { Order, OrderAttributes, OrderType } from "../config/associations";

class OrderService {
  async getAllOrdersPerCompany(companyId: string): Promise<Order[]> {
    return await Order.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["date", "DESC"]],
    });
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await Order.findByPk(id);
  }

  async createOrder(orderData: {
    companyId: string;
    type: OrderType;
    customerId: string;
    warehouseId: string;
    date: Date;
  }): Promise<Order> {
    const orderNumber = this.generateOrderNumber();

    return await Order.create({
      ...orderData,
      number: orderNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateOrder(
    id: string,
    updateData: Partial<OrderAttributes>
  ): Promise<Order | null> {
    const order = await Order.findByPk(id);
    if (!order) {
      return null;
    }

    await order.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return order;
  }

  async deleteOrder(id: string): Promise<boolean> {
    const order = await Order.findByPk(id);
    if (!order) {
      return false;
    }

    await order.update({
      deletedAt: new Date(),
    });

    return true;
  }

  async getOrdersByType(companyId: string, type: OrderType): Promise<Order[]> {
    return await Order.findAll({
      where: {
        companyId: companyId,
        type,
        deletedAt: null,
      },
      order: [["date", "DESC"]],
    });
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await Order.findAll({
      where: {
        customerId: customerId,
        deletedAt: null,
      },
      order: [["date", "DESC"]],
    });
  }

  async getOrdersByWarehouse(warehouseId: string): Promise<Order[]> {
    return await Order.findAll({
      where: {
        warehouseId: warehouseId,
        deletedAt: null,
      },
      order: [["date", "DESC"]],
    });
  }

  async getOrderCount(companyId: string): Promise<number> {
    return await Order.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `ORD-${timestamp}-${random}`;
  }

  validateOrderData(orderData: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!orderData.companyId) {
      errors.push("Company ID is required");
    }

    if (
      !orderData.type ||
      !["sales", "purchase", "transfer"].includes(orderData.type)
    ) {
      errors.push(
        "Valid order type is required (sales, purchase, or transfer)"
      );
    }

    if (!orderData.customerId) {
      errors.push("Customer ID is required");
    }

    if (!orderData.warehouseId) {
      errors.push("Warehouse ID is required");
    }

    if (!orderData.date) {
      errors.push("Order date is required");
    }

    if (orderData.date && isNaN(Date.parse(orderData.date))) {
      errors.push("Invalid date format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new OrderService();
