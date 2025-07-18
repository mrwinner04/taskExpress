import { Router, Request, Response } from "express";
import ProductService from "./product.service";
import {
  validateRequest,
  paginationSchema,
  createProductSchema,
  uuidSchema,
} from "../utility/zod.schemas";
import { ValidationUtils } from "../utility/validation.utils";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(paginationSchema, "query"),
  async (req: Request, res: Response) => {
    try {
      const { page, limit, companyId } = req.query as any;

      if (companyId) {
        const products =
          await ProductService.getAllProductsPerCompany(companyId);
        return res.status(200).json({
          success: true,
          data: products,
          message: "Products retrieved successfully",
        });
      }

      const result = await ProductService.getAllProducts(page, limit);

      return res.status(200).json({
        success: true,
        data: result.products,
        pagination: result.pagination,
        message: "Products retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get("/analytics/best-selling", async (req: Request, res: Response) => {
  try {
    const { companyId, limit = "10" } = req.query;

    const products = await ProductService.getBestSellingProducts(
      companyId ? (companyId as string) : undefined,
      parseInt(limit as string, 10)
    );

    return res.status(200).json({
      success: true,
      message: "Best-selling products retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error in best-selling products endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/analytics/highest-stock", async (req: Request, res: Response) => {
  try {
    const { companyId, limit = "10" } = req.query;

    const products = await ProductService.getProductsWithHighestStock(
      companyId ? (companyId as string) : undefined,
      parseInt(limit as string, 10)
    );

    return res.status(200).json({
      success: true,
      message: "Products with highest stock retrieved successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error in highest stock products endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get(
  "/company/:companyId/type/:type",
  validateRequest(
    z.object({
      companyId: uuidSchema,
    }),
    "params"
  ),
  async (req: Request, res: Response) => {
    try {
      const { companyId, type } = req.params as any;

      const products = await ProductService.getProductsByType(companyId, type);

      return res.status(200).json({
        success: true,
        data: products,
        message: `Products with type '${type}' retrieved successfully`,
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/company/:companyId/count",
  validateRequest(z.object({ companyId: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params as any;

      const count = await ProductService.getProductCount(companyId);

      return res.status(200).json({
        success: true,
        data: { count },
        message: "Product count retrieved successfully",
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

      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
        message: "Product retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createProductSchema),
  async (req: Request, res: Response) => {
    try {
      const { companyId, name, code, price, type, warehouseId } = req.body;

      const product = await ProductService.createProduct({
        companyId,
        name,
        code,
        price,
        type,
      });

      return res.status(201).json({
        success: true,
        data: product,
        message: "Product created successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, price, type } = req.body;

    if (!ValidationUtils.validateRequired(id, "Product ID", res)) return;

    const product = await ProductService.updateProduct(id as string, {
      name,
      code,
      price,
      type: type as "solid" | "liquid",
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Product ID", res)) return;

    const deleted = await ProductService.deleteProduct(id as string);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(204).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

export default router;
