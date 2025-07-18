import { Router, Request, Response } from "express";
import OrderService from "./order.service";
import {
  validateRequest,
  paginationSchema,
  uuidSchema,
  createOrderSchema,
  updateOrderSchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as any;

      const result = await OrderService.getAllOrders(page, limit);

      return res.status(200).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
        message: "Orders retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/company/:companyId",
  validateRequest(z.object({ companyId: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params as any;

      const orders = await OrderService.getAllOrdersPerCompany(companyId);

      return res.status(200).json({
        success: true,
        data: orders,
        message: "Orders retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

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
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const { companyId, type, customerId, warehouseId } = req.body;

      const order = await OrderService.createOrder({
        companyId,
        type,
        customerId,
        warehouseId,
      });

      return res.status(201).json({
        success: true,
        data: order,
        message: "Order created successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { type, customerId, warehouseId, date } = req.body;

      const order = await OrderService.updateOrder(id, {
        type,
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
      throw error;
    }
  }
);

export default router;
