import { Router } from "express";
import { WarehouseController } from "./warehouse.controller";

const router = Router();

router.get(
  "/company/:companyId",
  WarehouseController.getAllWarehousesPerCompany
);

router.get("/:id", WarehouseController.getWarehouseById);

router.post("/", WarehouseController.createWarehouse);

router.put("/:id", WarehouseController.updateWarehouse);

router.delete("/:id", WarehouseController.deleteWarehouse);

router.get("/company/:companyId/count", WarehouseController.getWarehouseCount);

export default router;
