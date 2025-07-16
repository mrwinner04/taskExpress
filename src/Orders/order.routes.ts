import { Router } from "express";
import { OrderController } from "./order.controller";

const router = Router();

router.get("/company/:companyId", OrderController.getAllOrders);

router.get("/company/:companyId/type/:type", OrderController.getOrdersByType);

router.get("/customer/:customerId", OrderController.getOrdersByCustomer);

router.get("/warehouse/:warehouseId", OrderController.getOrdersByWarehouse);

router.get("/:id", OrderController.getOrderById);

router.post("/", OrderController.createOrder);

router.put("/:id", OrderController.updateOrder);

router.delete("/:id", OrderController.deleteOrder);

router.get("/company/:companyId/count", OrderController.getOrderCount);

export default router;
