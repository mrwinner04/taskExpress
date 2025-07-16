import { Router } from "express";
import companiesRoutes from "../Company/companies.routes";
import customerRoutes from "../Customer/customer.routes";
import userRoutes from "../User/user.routes";
import productRoutes from "../Products/product.routes";
import warehouseRoutes from "../Warehouse/warehouse.routes";
import orderRoutes from "../Orders/order.routes";

const router = Router();

router.use("/companies", companiesRoutes);

router.use("/customers", customerRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/orders", orderRoutes);

export default router;
