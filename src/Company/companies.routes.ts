import { Router } from "express";
import CompanyController from "./company.controller";

const router = Router();

/**
 * GET /api/warehouse/companies
 */
router.get("/", CompanyController.getAllCompanies.bind(CompanyController));

/**
 * POST /api/warehouse/companies
 */
router.post("/", CompanyController.createCompany.bind(CompanyController));

/**
 * GET /api/warehouse/companies/:id
 */
router.get("/:id", CompanyController.getCompanyById.bind(CompanyController));

/**
 * PUT /api/warehouse/companies/:id
 */
router.put("/:id", CompanyController.updateCompany.bind(CompanyController));

/**
 * DELETE /api/warehouse/companies/:id
 */
router.delete("/:id", CompanyController.deleteCompany.bind(CompanyController));

export default router;
