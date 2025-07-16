import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

router.get("/company/:companyId", ProductController.getAllProducts);

router.get(
  "/company/:companyId/type/:type",
  ProductController.getProductsByType
);

router.get("/:id", ProductController.getProductById);

router.post("/", ProductController.createProduct);

router.put("/:id", ProductController.updateProduct);

router.delete("/:id", ProductController.deleteProduct);

export default router;
