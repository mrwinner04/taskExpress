import { Request, Response } from "express";
import { CompanyService } from "./company.service";
import { ValidationUtils } from "../Utils/ValidationUtils";

class CompanyController {
  async getAllCompanies(req: Request, res: Response) {
    try {
      const { page = "1", limit = "10" } = req.query;
      const result = await CompanyService.getAllCompanies(
        parseInt(page as string, 10),
        parseInt(limit as string, 10)
      );
      return res.status(200).json({
        success: true,
        message: "Companies retrieved successfully",
        data: result.companies,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error in get companies endpoint:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    }
  }

  async createCompany(req: Request, res: Response) {
    try {
      const { name, modifiedBy } = req.body;
      if (!ValidationUtils.validateRequired(name, "Company name", res)) return;
      const company = await CompanyService.createCompany({
        name: name.trim(),
        modifiedBy,
      });
      return res.status(201).json({
        success: true,
        message: "Company created successfully",
        data: company,
      });
    } catch (error) {
      console.error("Error in create company endpoint:", error);
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    }
  }

  async getCompanyById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Company ID", res)) return;
      const company = await CompanyService.getCompanyById(id);
      return res.status(200).json({
        success: true,
        message: "Company retrieved successfully",
        data: company,
      });
    } catch (error) {
      console.error("Error in get company endpoint:", error);
      const statusCode =
        error instanceof Error && error.message === "Company not found"
          ? 404
          : 500;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    }
  }

  async updateCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, modifiedBy } = req.body;
      if (!ValidationUtils.validateRequired(id, "Company ID", res)) return;
      const updateData: { name?: string; modifiedBy?: string } = {};
      if (name !== undefined) {
        if (name.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "Company name cannot be empty",
            data: null,
          });
        }
        updateData.name = name.trim();
      }
      if (modifiedBy !== undefined) {
        updateData.modifiedBy = modifiedBy;
      }
      const company = await CompanyService.updateCompany(id, updateData);
      return res.status(200).json({
        success: true,
        message: "Company updated successfully",
        data: company,
      });
    } catch (error) {
      console.error("Error in update company endpoint:", error);
      const statusCode =
        error instanceof Error && error.message === "Company not found"
          ? 404
          : 500;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    }
  }

  async deleteCompany(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { modifiedBy } = req.body;
      if (!ValidationUtils.validateRequired(id, "Company ID", res)) return;
      const result = await CompanyService.deleteCompany(id, modifiedBy);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      console.error("Error in delete company endpoint:", error);
      const statusCode =
        error instanceof Error && error.message === "Company not found"
          ? 404
          : 500;
      return res.status(statusCode).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    }
  }
}

export default new CompanyController();
