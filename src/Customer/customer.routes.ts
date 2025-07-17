import { Router, Request, Response } from "express";
import CustomerService from "./customer.service";
import { ValidationUtils, ValidationField } from "../Utils/ValidationUtils";

const router = Router();

router.get("/company/:companyId", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) return;

    const customers = await CustomerService.getAllCustomersPerCompany(
      companyId as string
    );

    return res.status(200).json({
      success: true,
      data: customers,
      message: "Customers retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Customer ID", res)) return;

    const customer = await CustomerService.getCustomerById(id as string);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
      message: "Customer retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyId, type, name, email } = req.body;

    const validationFields: ValidationField[] = [
      { value: companyId, fieldName: "Company ID" },
      { value: type, fieldName: "Type" },
      { value: name, fieldName: "Name" },
    ];

    if (!ValidationUtils.validateRequiredFields(validationFields, res)) return;

    const validation = CustomerService.validateCustomerData({
      companyId,
      type: type as "customer" | "supplier",
      name,
      email,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    const customer = await CustomerService.createCustomer({
      companyId,
      type: type as "customer" | "supplier",
      name,
      email,
    });

    return res.status(201).json({
      success: true,
      data: customer,
      message: "Customer created successfully",
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { type, name, email } = req.body;

    if (!ValidationUtils.validateRequired(id, "Customer ID", res)) return;

    const customer = await CustomerService.updateCustomer(id as string, {
      type,
      name,
      email,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: customer,
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Customer ID", res)) return;

    const deleted = await CustomerService.deleteCustomer(id as string);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(204).json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
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

      const customers = await CustomerService.getCustomersByType(
        companyId as string,
        type as "customer" | "supplier"
      );

      return res.status(200).json({
        success: true,
        data: customers,
        message: `Customers with type '${type}' retrieved successfully`,
      });
    } catch (error) {
      console.error("Error fetching customers by type:", error);
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

    const count = await CustomerService.getCustomerCount(companyId as string);

    return res.status(200).json({
      success: true,
      data: { count },
      message: "Customer count retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting customer count:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

export default router;
