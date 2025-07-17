import { Router, Request, Response } from "express";
import InvoiceService from "./invoice.service";
import { ValidationUtils, ValidationField } from "../utility/ValidationUtils";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", companyId } = req.query;

    if (companyId) {
      const invoices = await InvoiceService.getAllInvoices(companyId as string);
      return res.status(200).json({
        success: true,
        data: invoices,
        message: "Invoices retrieved successfully",
      });
    }

    const result = await InvoiceService.getAllInvoicesWithPagination(
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    return res.status(200).json({
      success: true,
      data: result.invoices,
      pagination: result.pagination,
      message: "Invoices retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
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

    const invoices = await InvoiceService.getAllInvoices(companyId as string);

    return res.status(200).json({
      success: true,
      data: invoices,
      message: "Invoices retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Invoice ID", res)) return;

    const invoice = await InvoiceService.getInvoiceById(id as string);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
      message: "Invoice retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyId, orderId, date, status } = req.body;

    // Validate required fields using the new validation method
    const validationFields: ValidationField[] = [
      { value: companyId, fieldName: "Company ID" },
      { value: orderId, fieldName: "Order ID" },
      { value: date, fieldName: "Date" },
    ];

    if (!ValidationUtils.validateRequiredFields(validationFields, res)) return;

    const validation = InvoiceService.validateInvoiceData({
      companyId,
      orderId,
      date,
      status,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

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
    console.error("Error creating invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;

    if (!ValidationUtils.validateRequired(id, "Invoice ID", res)) return;

    const invoice = await InvoiceService.updateInvoice(id as string, {
      date: date ? new Date(date) : undefined,
      status,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: invoice,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Invoice ID", res)) return;

    const deleted = await InvoiceService.deleteInvoice(id as string);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(204).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/order/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!ValidationUtils.validateRequired(orderId, "Order ID", res)) return;

    const invoices = await InvoiceService.getInvoicesByOrderId(
      orderId as string
    );

    return res.status(200).json({
      success: true,
      data: invoices,
      message: "Invoices for order retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching invoices by order:", error);
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

    const count = await InvoiceService.getInvoiceCount(companyId as string);

    return res.status(200).json({
      success: true,
      data: { count },
      message: "Invoice count retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting invoice count:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

export default router;
