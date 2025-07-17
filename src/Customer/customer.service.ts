import {
  Customer,
  CustomerAttributes,
  CustomerType,
} from "../config/associations";

class CustomerService {
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

  async getCustomersByType(
    companyId: string,
    type: CustomerType
  ): Promise<Customer[]> {
    return await Customer.findAll({
      where: {
        companyId,
        type,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  async getCustomerCount(companyId: string): Promise<number> {
    return await Customer.count({
      where: {
        companyId,
        deletedAt: null,
      },
    });
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
