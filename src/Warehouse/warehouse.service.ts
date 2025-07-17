import { Warehouse, WarehouseAttributes } from "../config/associations";
import { ProductType } from "../Products/product.model";

class WarehouseService {
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

  async getWarehousesByType(
    companyId: string,
    type: ProductType
  ): Promise<Warehouse[]> {
    return await Warehouse.findAll({
      where: {
        companyId: companyId,
        type,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  async getWarehouseCount(companyId: string): Promise<number> {
    return await Warehouse.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
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
