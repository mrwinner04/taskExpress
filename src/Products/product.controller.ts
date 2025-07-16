import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { ValidationUtils } from "../Utils/ValidationUtils";

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;

      const products = await ProductService.getAllProducts(companyId);

      return res.status(200).json({
        success: true,
        data: products,
        message: "Products retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Product ID", res)) return;

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
      console.error("Error fetching product:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const { companyId, name, code, price, type } = req.body;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(name, "Name", res)) return;
      if (!ValidationUtils.validateRequired(code, "Code", res)) return;
      if (!ValidationUtils.validateRequired(price, "Price", res)) return;

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
          errors: validation.errors,
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
        message: "Failed to create product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, code, price, type } = req.body;

      if (!ValidationUtils.validateRequired(id, "Product ID", res)) return;

      const product = await ProductService.updateProduct(id, {
        name,
        code,
        price,
        type: type as "solid" | "liquid",
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
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
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!ValidationUtils.validateRequired(id, "Product ID", res)) return;

      const deleted = await ProductService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
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
        message: "Failed to delete product",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getProductsByType(req: Request, res: Response) {
    try {
      const { companyId, type } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(type, "Type", res)) return;

      const products = await ProductService.getProductsByType(
        companyId,
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
        message: "Failed to fetch products by type",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getProductCount(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;

      const count = await ProductService.getProductCount(companyId);

      return res.status(200).json({
        success: true,
        data: { count },
        message: "Product count retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting product count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get product count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
