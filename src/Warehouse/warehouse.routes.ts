import { Router, Request, Response } from "express";
import WarehouseService from "./warehouse.service";
import { ValidationUtils, ValidationField } from "../utility/ValidationUtils";

const router = Router();

// Get all warehouses with pagination support
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const result = await WarehouseService.getAllWarehouses(
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    return res.status(200).json({
      success: true,
      data: result.warehouses,
      pagination: result.pagination,
      message: "Warehouses retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/company/:companyId", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) return;

    const warehouses = await WarehouseService.getAllWarehousesPerCompany(
      companyId as string
    );

    return res.status(200).json({
      success: true,
      data: warehouses,
      message: "Warehouses retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Warehouse ID", res)) return;

    const warehouse = await WarehouseService.getWarehouseById(id as string);

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
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
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyId, name, type, address } = req.body;

    // Validate required fields using the new validation method
    const validationFields: ValidationField[] = [
      { value: companyId, fieldName: "Company ID" },
      { value: name, fieldName: "Name" },
    ];

    if (!ValidationUtils.validateRequiredFields(validationFields, res)) return;

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
      message: "Invalid",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, address } = req.body;

    if (!ValidationUtils.validateRequired(id, "Warehouse ID", res)) return;

    const warehouse = await WarehouseService.updateWarehouse(id as string, {
      name,
      type: type as "solid" | "liquid",
      address,
    });

    if (!warehouse) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
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
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Warehouse ID", res)) return;

    const deleted = await WarehouseService.deleteWarehouse(id as string);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
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
      message: "Invalid",
    });
  }
});

router.get(
  "/company/:companyId/type/:type",
  async (req: Request, res: Response) => {
    try {
      const { companyId, type } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;

      const warehouses = await WarehouseService.getWarehousesByType(
        companyId as string,
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
        message: "Invalid",
      });
    }
  }
);

router.get("/company/:companyId/count", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) return;

    const count = await WarehouseService.getWarehouseCount(companyId as string);

    return res.status(200).json({
      success: true,
      data: { count },
      message: "Warehouse count retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting warehouse count:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

export default router;
