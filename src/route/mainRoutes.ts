import { Router } from "express";
import companiesRoutes from "../company/company.routes";
import customerRoutes from "../customer/customer.routes";
import userRoutes from "../user/user.routes";
import productRoutes from "../product/product.routes";
import warehouseRoutes from "../warehouse/warehouse.routes";
import orderRoutes from "../order/order.routes";
import invoiceRoutes from "../invoice/invoice.routes";
import orderItemRoutes from "../order-item/order-item.routes";
const router = Router();

router.use("/companies", companiesRoutes);
router.use("/customers", customerRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/orders", orderRoutes);
router.use("/order-items", orderItemRoutes);
router.use("/invoices", invoiceRoutes);

export default router;
