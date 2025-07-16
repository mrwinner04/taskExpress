import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { ValidationUtils } from "../Utils/ValidationUtils";

export class OrderController {
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;

      const orders = await OrderService.getAllOrders(companyId);

      return res.status(200).json({
        success: true,
        data: orders,
        message: "Orders retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Order ID", res)) return;

      const order = await OrderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
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
        message: "Failed to fetch order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async createOrder(req: Request, res: Response) {
    try {
      const { companyId, type, customerId, warehouseId, date } = req.body;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;
      if (!ValidationUtils.validateRequired(customerId, "Customer ID", res))
        return;
      if (!ValidationUtils.validateRequired(warehouseId, "Warehouse ID", res))
        return;
      if (!ValidationUtils.validateRequired(date, "Date", res)) return;

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
          errors: validation.errors,
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
        message: "Failed to create order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type, customerId, warehouseId, date } = req.body;

      if (!ValidationUtils.validateRequired(id, "Order ID", res)) return;

      const order = await OrderService.updateOrder(id, {
        type: type as "sales" | "purchase" | "transfer",
        customerId,
        warehouseId,
        date: date ? new Date(date) : undefined,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
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
        message: "Failed to update order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Order ID", res)) return;

      const deleted = await OrderService.deleteOrder(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
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
        message: "Failed to delete order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrdersByType(req: Request, res: Response) {
    try {
      const { companyId, type } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;

      const orders = await OrderService.getOrdersByType(
        companyId,
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
        message: "Failed to fetch orders by type",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrdersByCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      if (!ValidationUtils.validateRequired(customerId, "Customer ID", res))
        return;

      const orders = await OrderService.getOrdersByCustomer(customerId);

      return res.status(200).json({
        success: true,
        data: orders,
        message: "Orders for customer retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching orders by customer:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders by customer",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrdersByWarehouse(req: Request, res: Response) {
    try {
      const { warehouseId } = req.params;
      if (!ValidationUtils.validateRequired(warehouseId, "Warehouse ID", res))
        return;

      const orders = await OrderService.getOrdersByWarehouse(warehouseId);

      return res.status(200).json({
        success: true,
        data: orders,
        message: "Orders for warehouse retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching orders by warehouse:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders by warehouse",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getOrderCount(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;

      const count = await OrderService.getOrderCount(companyId);

      return res.status(200).json({
        success: true,
        data: { count },
        message: "Order count retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting order count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get order count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
