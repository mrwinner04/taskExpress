import {
  Customer,
  CustomerAttributes,
  CustomerType,
} from "../config/associations";
import { QueryTypes } from "sequelize";
import sequelize from "../config/database";

interface CustomerWithMostOrders {
  id: string;
  name: string;
  email: string;
  type: string;
  totalOrders: number;
  totalOrderValue: number;
}

class CustomerService {
  async getAllCustomers(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    customers: Customer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await Customer.findAndCountAll({
      where: {
        deletedAt: null,
      },
      order: [["name", "ASC"]],
      limit,
      offset,
    });

    return {
      customers: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getAllCustomersPerCompany(companyId: string): Promise<Customer[]> {
    return await Customer.findAll({
      where: {
        companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return await Customer.findByPk(id);
  }

  async createCustomer(customerData: {
    companyId: string;
    type: CustomerType;
    name: string;
    email?: string;
  }): Promise<Customer> {
    return await Customer.create({
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateCustomer(
    id: string,
    updateData: Partial<CustomerAttributes>
  ): Promise<Customer | null> {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return null;
    }

    await customer.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return customer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return false;
    }

    await customer.update({
      deletedAt: new Date(),
    });

    return true;
  }

  async getCustomersWithMostOrders(
    companyId?: string,
    limit: number = 10
  ): Promise<CustomerWithMostOrders[]> {
    try {
      const whereClause = companyId ? 'WHERE o."companyId" = :companyId' : "";

      const query = `
        SELECT 
          c.id,
          c.name,
          c.email,
          c.type,
          COUNT(DISTINCT o.id) as "totalOrders",
          COALESCE(SUM(
            (SELECT SUM(oi.quantity * oi.price) 
             FROM order_items oi 
             WHERE oi."orderId" = o.id AND oi."deletedAt" IS NULL)
          ), 0) as "totalOrderValue"
        FROM customers c
        LEFT JOIN orders o ON c.id = o."customerId" 
          AND o."deletedAt" IS NULL
        ${whereClause}
        AND c."deletedAt" IS NULL
        GROUP BY c.id, c.name, c.email, c.type
        ORDER BY "totalOrders" DESC, "totalOrderValue" DESC
        LIMIT :limit
      `;

      const results = (await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { companyId, limit },
      })) as CustomerWithMostOrders[];

      return results;
    } catch (error) {
      console.error("Error getting customers with most orders:", error);
      throw new Error("Failed to retrieve customers with most orders");
    }
  }

  validateCustomerData(customerData: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!customerData.companyId) {
      errors.push("Company ID is required");
    }

    if (
      !customerData.type ||
      !["customer", "supplier"].includes(customerData.type)
    ) {
      errors.push("Valid customer type is required (customer or supplier)");
    }

    if (!customerData.name || customerData.name.trim().length === 0) {
      errors.push("Customer name is required");
    }

    if (customerData.name && customerData.name.length > 255) {
      errors.push("Customer name must be less than 255 characters");
    }

    if (
      customerData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)
    ) {
      errors.push("Invalid email format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new CustomerService();
