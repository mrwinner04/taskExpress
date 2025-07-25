import { Order, OrderAttributes, OrderType } from "../config/associations";

class OrderService {
  // Get all orders across all companies with pagination
  async getAllOrders(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await Order.findAndCountAll({
      where: {
        deletedAt: null,
      },
      order: [["date", "DESC"]],
      limit,
      offset,
    });

    return {
      orders: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

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
    date?: Date;
  }): Promise<Order> {
    const orderNumber = this.generateOrderNumber();
    const currentDate = new Date();

    return await Order.create({
      companyId: orderData.companyId,
      type: orderData.type,
      customerId: orderData.customerId,
      warehouseId: orderData.warehouseId,
      date: orderData.date || currentDate,
      number: orderNumber,
      createdAt: currentDate,
      updatedAt: currentDate,
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
