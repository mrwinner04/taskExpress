import { Router, Request, Response } from "express";
import ProductService from "./product.service";
import { ValidationUtils, ValidationField } from "../utility/ValidationUtils";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", companyId } = req.query;

    if (companyId) {
      const products = await ProductService.getAllProductsPerCompany(
        companyId as string
      );
      return res.status(200).json({
        success: true,
        data: products,
        message: "Products retrieved successfully",
      });
    }

    const result = await ProductService.getAllProducts(
      parseInt(page as string, 10),
      parseInt(limit as string, 10)
    );

    return res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

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
  async (req: Request, res: Response) => {
    try {
      const { companyId, type } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;

      const products = await ProductService.getProductsByType(
        companyId as string,
        type as "solid" | "liquid"
      );

      return res.status(200).json({
        success: true,
        data: products,
        message: `Products with type '${type}' retrieved successfully`,
      });
    } catch (error) {
      console.error("Error fetching products by type:", error);
      return res.status(500).json({
        success: false,
        message: "Invalid",
      });
    }
  }
);

router.get("/company/:companyId/count", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) return;

    const count = await ProductService.getProductCount(companyId as string);

    return res.status(200).json({
      success: true,
      data: { count },
      message: "Product count retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting product count:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "Product ID", res)) return;

    const product = await ProductService.getProductById(id as string);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyId, name, code, price, type } = req.body;

    const validationFields: ValidationField[] = [
      { value: companyId, fieldName: "Company ID" },
      { value: name, fieldName: "Name" },
      { value: code, fieldName: "Code" },
      { value: price, fieldName: "Price" },
    ];

    if (!ValidationUtils.validateRequiredFields(validationFields, res)) return;

    const validation = ProductService.validateProductData({
      companyId,
      name,
      code,
      price: parseFloat(price),
      type: type as "solid" | "liquid",
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    const product = await ProductService.createProduct({
      companyId,
      name,
      code,
      price: parseFloat(price),
      type: type as "solid" | "liquid",
    });

    return res.status(201).json({
      success: true,
      data: product,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

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
