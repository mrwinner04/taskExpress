import { Router } from "express";
import { CustomerController } from "./customer.controller";

const router = Router();

router.get("/company/:companyId", CustomerController.getAllCustomersByCompany);

router.get("/:id", CustomerController.getCustomerById);

router.post("/", CustomerController.createCustomer);

router.put("/:id", CustomerController.updateCustomer);

router.delete("/:id", CustomerController.deleteCustomer);

router.get(
  "/company/:companyId/type/:type",
  CustomerController.getCustomersByType
);

router.get("/company/:companyId/count", CustomerController.getCustomerCount);

export default router;
