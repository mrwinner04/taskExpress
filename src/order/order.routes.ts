import { Router, Request, Response } from "express";
import OrderService from "./order.service";
import { ValidationUtils, ValidationField } from "../utility/ValidationUtils";

const router = Router();

// Get all orders with pagination support
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10" } = req.query;

    const result = await OrderService.getAllOrders(
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    return res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
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

    const orders = await OrderService.getAllOrdersPerCompany(
      companyId as string
    );

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Order ID", res)) return;

    const order = await OrderService.getOrderById(id as string);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyId, type, customerId, warehouseId, date } = req.body;

    const validationFields: ValidationField[] = [
      { value: companyId, fieldName: "Company ID" },
      { value: type, fieldName: "Type" },
      { value: customerId, fieldName: "Customer ID" },
      { value: warehouseId, fieldName: "Warehouse ID" },
      { value: date, fieldName: "Date" },
    ];

    if (!ValidationUtils.validateRequiredFields(validationFields, res)) return;

    const validation = OrderService.validateOrderData({
      companyId,
      type: type as "sales" | "purchase" | "transfer",
      customerId,
      warehouseId,
      date,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    const order = await OrderService.createOrder({
      companyId,
      type: type as "sales" | "purchase" | "transfer",
      customerId,
      warehouseId,
      date: new Date(date),
    });

    return res.status(201).json({
      success: true,
      data: order,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, customerId, warehouseId, date } = req.body;

    if (!ValidationUtils.validateRequired(id, "Order ID", res)) return;

    const order = await OrderService.updateOrder(id as string, {
      type: type as "sales" | "purchase" | "transfer",
      customerId,
      warehouseId,
      date: date ? new Date(date) : undefined,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order updated successfully",
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Order ID", res)) return;

    const deleted = await OrderService.deleteOrder(id as string);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(204).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
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

      const orders = await OrderService.getOrdersByType(
        companyId as string,
        type as "sales" | "purchase" | "transfer"
      );

      return res.status(200).json({
        success: true,
        data: orders,
        message: `Orders with type '${type}' retrieved successfully`,
      });
    } catch (error) {
      console.error("Error fetching orders by type:", error);
      return res.status(500).json({
        success: false,
        message: "Invalid",
      });
    }
  }
);

router.get("/customer/:customerId", async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    if (!ValidationUtils.validateRequired(customerId, "Customer ID", res))
      return;

    const orders = await OrderService.getOrdersByCustomer(customerId as string);

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders for customer retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching orders by customer:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/warehouse/:warehouseId", async (req: Request, res: Response) => {
  try {
    const { warehouseId } = req.params;

    if (!ValidationUtils.validateRequired(warehouseId, "Warehouse ID", res))
      return;

    const orders = await OrderService.getOrdersByWarehouse(
      warehouseId as string
    );

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders for warehouse retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching orders by warehouse:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/company/:companyId/count", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) return;

    const count = await OrderService.getOrderCount(companyId as string);

    return res.status(200).json({
      success: true,
      data: { count },
      message: "Order count retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting order count:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

export default router;
