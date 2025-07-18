// src/order/order-item.routes.ts
import { Router, Request, Response } from "express";
import OrderItemService from "./order-item.service";
import {
  validateRequest,
  paginationSchema,
  createOrderItemSchema,
  updateOrderItemSchema,
  uuidSchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as any;

      const result = await OrderItemService.getAllOrderItems(page, limit);

      return res.status(200).json({
        success: true,
        data: result.orderItems,
        pagination: result.pagination,
        message: "Order items retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/order/:orderId",
  validateRequest(z.object({ orderId: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params as any;

      const orderItems = await OrderItemService.getOrderItemsByOrder(orderId);

      return res.status(200).json({
        success: true,
        data: orderItems,
        message: "Order items retrieved successfully",
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

      const orderItem = await OrderItemService.getOrderItemById(id);

      if (!orderItem) {
        return res.status(404).json({
          success: false,
          message: "Order item not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: orderItem,
        message: "Order item retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createOrderItemSchema),
  async (req: Request, res: Response) => {
    try {
      const { orderId, productId, quantity, price, modifiedBy } = req.body;

      const orderItem = await OrderItemService.createOrderItem({
        orderId,
        productId,
        quantity,
        price,
        modifiedBy,
      });

      return res.status(201).json({
        success: true,
        data: orderItem,
        message: "Order item created successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateOrderItemSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { productId, quantity, price, modifiedBy } = req.body;

      const orderItem = await OrderItemService.updateOrderItem(id, {
        productId,
        quantity,
        price,
        modifiedBy,
      });

      if (!orderItem) {
        return res.status(404).json({
          success: false,
          message: "Order item not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: orderItem,
        message: "Order item updated successfully",
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

      const deleted = await OrderItemService.deleteOrderItem(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Order item not found",
        });
      }

      return res.status(204).json({
        success: true,
        message: "Order item deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
