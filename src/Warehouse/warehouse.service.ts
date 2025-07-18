import { Warehouse, WarehouseAttributes } from "../config/associations";
import { ProductType } from "../product/product.model";

class WarehouseService {
  async getAllWarehouses(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    warehouses: Warehouse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    const { count, rows } = await Warehouse.findAndCountAll({
      where: {
        deletedAt: null,
      },
      order: [["name", "ASC"]],
      limit,
      offset,
    });

    return {
      warehouses: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async getAllWarehousesPerCompany(companyId: string): Promise<Warehouse[]> {
    return await Warehouse.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  async getWarehouseById(id: string): Promise<Warehouse | null> {
    return await Warehouse.findByPk(id);
  }

  async createWarehouse(warehouseData: {
    companyId: string;
    name: string;
    type?: ProductType;
    address?: string;
  }): Promise<Warehouse> {
    return await Warehouse.create({
      ...warehouseData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateWarehouse(
    id: string,
    updateData: Partial<WarehouseAttributes>
  ): Promise<Warehouse | null> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      return null;
    }

    await warehouse.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return warehouse;
  }

  async deleteWarehouse(id: string): Promise<boolean> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      return false;
    }

    await warehouse.update({
      deletedAt: new Date(),
    });

    return true;
  }

  validateWarehouseData(warehouseData: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!warehouseData.companyId) {
      errors.push("Company ID is required");
    }

    if (!warehouseData.name || warehouseData.name.trim().length === 0) {
      errors.push("Warehouse name is required");
    }

    if (warehouseData.name && warehouseData.name.length > 255) {
      errors.push("Warehouse name must be less than 255 characters");
    }

    if (
      warehouseData.type &&
      !["solid", "liquid"].includes(warehouseData.type)
    ) {
      errors.push("Valid warehouse type is required (solid or liquid)");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new WarehouseService();
