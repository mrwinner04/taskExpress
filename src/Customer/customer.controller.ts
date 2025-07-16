import { Request, Response } from "express";
import { CustomerService } from "./customer.service";
import { ValidationUtils } from "../Utils/ValidationUtils";

export class CustomerController {
  static async getAllCustomersByCompany(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      const customers =
        await CustomerService.getAllCustomersPerCompany(companyId);
      return res.status(200).json({
        success: true,
        data: customers,
        message: "Customers retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch customers",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Customer ID", res)) return;
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
      console.error("Error fetching customer:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch customer",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async createCustomer(req: Request, res: Response) {
    try {
      const { companyId, type, name, email } = req.body;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;
      if (!ValidationUtils.validateRequired(name, "Name", res)) return;
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
          errors: validation.errors,
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
        message: "Failed to create customer",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { type, name, email } = req.body;
      if (!ValidationUtils.validateRequired(id, "Customer ID", res)) return;
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
      console.error("Error updating customer:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update customer",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Customer ID", res)) return;
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
      console.error("Error deleting customer:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete customer",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getCustomersByType(req: Request, res: Response) {
    try {
      const { companyId, type } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;
      const customers = await CustomerService.getCustomersByType(
        companyId,
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
        message: "Failed to fetch customers by type",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getCustomerCount(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      const count = await CustomerService.getCustomerCount(companyId);
      return res.status(200).json({
        success: true,
        data: { count },
        message: "Customer count retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting customer count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get customer count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
