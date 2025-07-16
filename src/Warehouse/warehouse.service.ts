import Warehouse, { WarehouseAttributes } from "./warehouse.model";
import { ProductType } from "../Products/product.model";

export class WarehouseService {
  static async getAllWarehouses(companyId: string): Promise<Warehouse[]> {
    return await Warehouse.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getWarehouseById(id: string): Promise<Warehouse | null> {
    return await Warehouse.findByPk(id);
  }

  static async createWarehouse(warehouseData: {
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

  static async updateWarehouse(
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

  static async deleteWarehouse(id: string): Promise<boolean> {
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      return false;
    }

    await warehouse.update({
      deletedAt: new Date(),
    });

    return true;
  }

  static async getWarehousesByType(
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

  static async searchWarehouses(
    companyId: string,
    searchTerm: string
  ): Promise<Warehouse[]> {
    return await Warehouse.findAll({
      where: {
        companyId: companyId,
        name: {
          [require("sequelize").Op.iLike]: `%${searchTerm}%`,
        },
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getWarehousesByCompany(companyId: string): Promise<Warehouse[]> {
    return await Warehouse.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getWarehouseCount(companyId: string): Promise<number> {
    return await Warehouse.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
  }

  static async getWarehouseCountByType(
    companyId: string,
    type: ProductType
  ): Promise<number> {
    return await Warehouse.count({
      where: {
        companyId: companyId,
        type,
        deletedAt: null,
      },
    });
  }

  static async isWarehouseNameExists(
    companyId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const whereClause: any = {
      companyId: companyId,
      name,
      deletedAt: null,
    };

    if (excludeId) {
      whereClause.id = {
        [require("sequelize").Op.ne]: excludeId,
      };
    }

    const count = await Warehouse.count({ where: whereClause });
    return count > 0;
  }

  static validateWarehouseData(warehouseData: any): {
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
