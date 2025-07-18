import { Router, Request, Response } from "express";
import CompanyService from "./company.service";
import {
  validateRequest,
  paginationSchema,
  uuidSchema,
  createCompanySchema,
  updateCompanySchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit } = req.query as any;

      const result = await CompanyService.getAllCompanies(page, limit);

      return res.status(200).json({
        success: true,
        message: "Companies retrieved successfully",
        data: result.companies,
        pagination: result.pagination,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createCompanySchema),
  async (req: Request, res: Response) => {
    try {
      const { name, modifiedBy } = req.body;

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

      const company = await CompanyService.getCompanyById(id);

      return res.status(200).json({
        success: true,
        message: "Company retrieved successfully",
        data: company,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateCompanySchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { name, modifiedBy } = req.body;

      const updateData: { name?: string; modifiedBy?: string } = {};
      if (name !== undefined) {
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
      throw error;
    }
  }
);

router.delete(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(z.object({ modifiedBy: z.string().optional() })),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { modifiedBy } = req.body;

      const result = await CompanyService.deleteCompany(id, modifiedBy);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: null,
      });
    } catch (error) {
      throw error;
    }
  }
);

export default router;
