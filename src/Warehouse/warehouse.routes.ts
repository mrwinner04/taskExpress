import { Router, Request, Response } from "express";
import WarehouseService from "./warehouse.service";
import {
  validateRequest,
  paginationSchema,
  uuidSchema,
  createWarehouseSchema,
  updateWarehouseSchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

// Get all warehouses with pagination validation
router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as any;

      const result = await WarehouseService.getAllWarehouses(page, limit);

      return res.status(200).json({
        success: true,
        data: result.warehouses,
        pagination: result.pagination,
        message: "Warehouses retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

// Get warehouses by company with UUID validation
router.get(
  "/company/:companyId",
  validateRequest(z.object({ companyId: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params as any;

      const warehouses =
        await WarehouseService.getAllWarehousesPerCompany(companyId);

      return res.status(200).json({
        success: true,
        data: warehouses,
        message: "Warehouses retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

// Get warehouse by ID with UUID validation
router.get(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

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
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createWarehouseSchema),
  async (req: Request, res: Response) => {
    try {
      const { companyId, name, type, address } = req.body;

      const warehouse = await WarehouseService.createWarehouse({
        companyId,
        name,
        type,
        address,
      });

      return res.status(201).json({
        success: true,
        data: warehouse,
        message: "Warehouse created successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateWarehouseSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { name, type, address } = req.body;

      const warehouse = await WarehouseService.updateWarehouse(id, {
        name,
        type,
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
      throw error;
    }
  }
);

router.delete(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

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
      throw error;
    }
  }
);

export default router;
