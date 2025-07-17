import { Router, Request, Response } from "express";
import CompanyService from "./company.service";
import { ValidationUtils } from "../utility/ValidationUtils";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
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
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, modifiedBy } = req.body;

    if (!ValidationUtils.validateRequired(name, "Company name", res)) return;

    const company = await CompanyService.createCompany({
      name: (name as string).trim(),
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
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Company ID", res)) return;

    const company = await CompanyService.getCompanyById(id as string);

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
      message: "Invalid",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, modifiedBy } = req.body;

    if (!ValidationUtils.validateRequired(id, "Company ID", res)) return;

    const updateData: { name?: string; modifiedBy?: string } = {};
    if (name !== undefined) {
      if (name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
        });
      }
      updateData.name = name.trim();
    }
    if (modifiedBy !== undefined) {
      updateData.modifiedBy = modifiedBy;
    }

    const company = await CompanyService.updateCompany(
      id as string,
      updateData
    );

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
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { modifiedBy } = req.body;

    if (!ValidationUtils.validateRequired(id, "Company ID", res)) return;

    const result = await CompanyService.deleteCompany(id as string, modifiedBy);

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
      message: "Invalid",
    });
  }
});

export default router;
