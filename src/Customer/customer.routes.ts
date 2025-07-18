import { Router, Request, Response } from "express";
import CustomerService from "./customer.service";
import {
  validateRequest,
  paginationSchema,
  uuidSchema,
  createCustomerSchema,
  updateCustomerSchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as any;

      const result = await CustomerService.getAllCustomers(page, limit);

      return res.status(200).json({
        success: true,
        data: result.customers,
        pagination: result.pagination,
        message: "Customers retrieved successfully",
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

      const customers =
        await CustomerService.getAllCustomersPerCompany(companyId);

      return res.status(200).json({
        success: true,
        data: customers,
        message: "Customers retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/analytics/most-orders",
  validateRequest(
    z.object({
      companyId: uuidSchema.optional(),
      limit: z.coerce.number().int().positive().max(100).default(10),
    }),
    "query"
  ),
  async (req: Request, res: Response) => {
    try {
      const { companyId, limit } = req.query as any;

      const customers = await CustomerService.getCustomersWithMostOrders(
        companyId,
        limit
      );

      return res.status(200).json({
        success: true,
        message: "Customers with most orders retrieved successfully",
        data: customers,
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

      const customer = await CustomerService.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: customer,
        message: "Customer retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createCustomerSchema),
  async (req: Request, res: Response) => {
    try {
      const { companyId, type, name, email } = req.body;

      const customer = await CustomerService.createCustomer({
        companyId,
        type,
        name,
        email,
      });

      return res.status(201).json({
        success: true,
        data: customer,
        message: "Customer created successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateCustomerSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { type, name, email } = req.body;

      const customer = await CustomerService.updateCustomer(id, {
        type,
        name,
        email,
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: customer,
        message: "Customer updated successfully",
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

      const deleted = await CustomerService.deleteCustomer(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      return res.status(204).json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
