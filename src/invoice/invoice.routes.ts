import { Router, Request, Response } from "express";
import InvoiceService from "./invoice.service";
import {
  validateRequest,
  paginationSchema,
  uuidSchema,
  createInvoiceSchema,
  updateInvoiceSchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit, companyId } = req.query as any;

      if (companyId) {
        const invoices = await InvoiceService.getAllInvoices(companyId);
        return res.status(200).json({
          success: true,
          data: invoices,
          message: "Invoices retrieved successfully",
        });
      }

      const result = await InvoiceService.getAllInvoicesWithPagination(
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        data: result.invoices,
        pagination: result.pagination,
        message: "Invoices retrieved successfully",
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

      const invoices = await InvoiceService.getAllInvoices(companyId);

      return res.status(200).json({
        success: true,
        data: invoices,
        message: "Invoices retrieved successfully",
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

      const invoice = await InvoiceService.getInvoiceById(id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: invoice,
        message: "Invoice retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createInvoiceSchema),
  async (req: Request, res: Response) => {
    try {
      const { companyId, orderId, date, status } = req.body;

      const invoice = await InvoiceService.createInvoice({
        companyId,
        orderId,
        date: new Date(date),
        status,
      });

      return res.status(201).json({
        success: true,
        data: invoice,
        message: "Invoice created successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateInvoiceSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { date, status } = req.body;

      const invoice = await InvoiceService.updateInvoice(id, {
        date: date ? new Date(date) : undefined,
        status,
      });

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: invoice,
        message: "Invoice updated successfully",
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

      const deleted = await InvoiceService.deleteInvoice(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      return res.status(204).json({
        success: true,
        message: "Invoice deleted successfully",
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

      const invoices = await InvoiceService.getInvoicesByOrderId(orderId);

      return res.status(200).json({
        success: true,
        data: invoices,
        message: "Invoices for order retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/company/:companyId/count",
  validateRequest(z.object({ companyId: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params as any;

      const count = await InvoiceService.getInvoiceCount(companyId);

      return res.status(200).json({
        success: true,
        data: { count },
        message: "Invoice count retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
