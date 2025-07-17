import { Invoice, InvoiceAttributes } from "../config/associations";

class InvoiceService {
  async getAllInvoicesPerCompany(companyId: string): Promise<Invoice[]> {
    return await Invoice.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["date", "DESC"]],
    });
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return await Invoice.findByPk(id);
  }

  async createInvoice(invoiceData: {
    companyId: string;
    orderId: string;
    date: Date;
    status?: string;
  }): Promise<Invoice> {
    const invoiceNumber = this.generateInvoiceNumber();

    return await Invoice.create({
      ...invoiceData,
      number: invoiceNumber,
      status: invoiceData.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateInvoice(
    id: string,
    updateData: Partial<InvoiceAttributes>
  ): Promise<Invoice | null> {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return null;
    }

    await invoice.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return invoice;
  }

  async deleteInvoice(id: string): Promise<boolean> {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return false;
    }

    await invoice.update({
      deletedAt: new Date(),
    });

    return true;
  }

  async getInvoicesByOrderId(orderId: string): Promise<Invoice[]> {
    return await Invoice.findAll({
      where: {
        orderId: orderId,
        deletedAt: null,
      },
      order: [["date", "DESC"]],
    });
  }

  async getInvoiceCount(companyId: string): Promise<number> {
    return await Invoice.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
  }

  private generateInvoiceNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `INV-${timestamp}-${random}`;
  }

  validateInvoiceData(invoiceData: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!invoiceData.companyId) {
      errors.push("Company ID is required");
    }

    if (!invoiceData.orderId) {
      errors.push("Order ID is required");
    }

    if (!invoiceData.date) {
      errors.push("Invoice date is required");
    }

    if (invoiceData.date && isNaN(Date.parse(invoiceData.date))) {
      errors.push("Invalid date format");
    }

    if (
      invoiceData.status &&
      !["pending", "paid", "cancelled", "overdue"].includes(invoiceData.status)
    ) {
      errors.push("Invalid invoice status");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new InvoiceService();
