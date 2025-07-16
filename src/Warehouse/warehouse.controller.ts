import { Request, Response } from "express";
import { WarehouseService } from "./warehouse.service";
import { ValidationUtils } from "../Utils/ValidationUtils";

export class WarehouseController {
  static async getAllWarehousesPerCompany(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;

      const warehouses = await WarehouseService.getAllWarehouses(companyId);

      return res.status(200).json({
        success: true,
        data: warehouses,
        message: "Warehouses retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch warehouses",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getWarehouseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Warehouse ID", res)) return;

      const warehouse = await WarehouseService.getWarehouseById(id);

      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: warehouse,
        message: "Warehouse retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching warehouse:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch warehouse",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async createWarehouse(req: Request, res: Response) {
    try {
      const { companyId, name, type, address } = req.body;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(name, "Name", res)) return;

      const validation = WarehouseService.validateWarehouseData({
        companyId,
        name,
        type: type as "solid" | "liquid",
        address,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      const warehouse = await WarehouseService.createWarehouse({
        companyId,
        name,
        type: type as "solid" | "liquid",
        address,
      });

      return res.status(201).json({
        success: true,
        data: warehouse,
        message: "Warehouse created successfully",
      });
    } catch (error) {
      console.error("Error creating warehouse:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create warehouse",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateWarehouse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, address } = req.body;

      if (!ValidationUtils.validateRequired(id, "Warehouse ID", res)) return;

      const warehouse = await WarehouseService.updateWarehouse(id, {
        name,
        type: type as "solid" | "liquid",
        address,
      });

      if (!warehouse) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: warehouse,
        message: "Warehouse updated successfully",
      });
    } catch (error) {
      console.error("Error updating warehouse:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update warehouse",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async deleteWarehouse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Warehouse ID", res)) return;

      const deleted = await WarehouseService.deleteWarehouse(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Warehouse not found",
        });
      }

      return res.status(204).json({
        success: true,
        message: "Warehouse deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete warehouse",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getWarehousesByType(req: Request, res: Response) {
    try {
      const { companyId, type } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;

      const warehouses = await WarehouseService.getWarehousesByType(
        companyId,
        type as "solid" | "liquid"
      );

      return res.status(200).json({
        success: true,
        data: warehouses,
        message: `Warehouses with type '${type}' retrieved successfully`,
      });
    } catch (error) {
      console.error("Error fetching warehouses by type:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch warehouses by type",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getWarehouseCount(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;

      const count = await WarehouseService.getWarehouseCount(companyId);

      return res.status(200).json({
        success: true,
        data: { count },
        message: "Warehouse count retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting warehouse count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get warehouse count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
