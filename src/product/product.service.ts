import {
  Product,
  ProductAttributes,
  ProductType,
} from "../config/associations";
import { QueryTypes } from "sequelize";
import sequelize from "../config/database";

interface BestSellingProduct {
  id: string;
  name: string;
  code: string;
  totalQuantitySold: number;
  totalRevenue: number;
  orderCount: number;
}

interface ProductStock {
  id: string;
  name: string;
  code: string;
  currentStock: number;
  type: string;
  price: number;
}

class ProductService {
  async getAllProducts(
    page: number = 1,
    limit: number = 10
  ): Promise<{ products: Product[]; pagination: any }> {
    const offset = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.findAll({
        where: {
          deletedAt: null,
        },
        order: [["name", "ASC"]],
        limit,
        offset,
      }),
      Product.count({
        where: {
          deletedAt: null,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async getAllProductsPerCompany(companyId: string): Promise<Product[]> {
    return await Product.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  async getProductById(id: string): Promise<Product | null> {
    return await Product.findByPk(id);
  }

  async createProduct(productData: {
    companyId: string;
    name: string;
    code: string;
    price: number;
    type: ProductType;
  }): Promise<Product> {
    return await Product.create({
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateProduct(
    id: string,
    updateData: Partial<ProductAttributes>
  ): Promise<Product | null> {
    const product = await Product.findByPk(id);
    if (!product) {
      return null;
    }

    await product.update({
      ...updateData,
      updatedAt: new Date(),
    });

    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const product = await Product.findByPk(id);
    if (!product) {
      return false;
    }

    await product.update({
      deletedAt: new Date(),
    });

    return true;
  }

  async getProductsByType(
    companyId: string,
    type: ProductType
  ): Promise<Product[]> {
    return await Product.findAll({
      where: {
        companyId: companyId,
        type,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  async getProductCount(companyId: string): Promise<number> {
    return await Product.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
  }

  async getBestSellingProducts(
    companyId?: string,
    limit: number = 10
  ): Promise<BestSellingProduct[]> {
    try {
      const whereClause = companyId ? 'WHERE o."companyId" = :companyId' : "";

      const query = `
        SELECT 
          p.id,
          p.name,
          p.code,
          COALESCE(SUM(oi.quantity), 0) as "totalQuantitySold",
          COALESCE(SUM(oi.quantity * oi.price), 0) as "totalRevenue",
          COUNT(DISTINCT o.id) as "orderCount"
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi."productId" 
          AND oi."deletedAt" IS NULL
        LEFT JOIN orders o ON oi."orderId" = o.id 
          AND o."deletedAt" IS NULL 
          AND o.type = 'sales'
        ${whereClause}
        AND p."deletedAt" IS NULL
        GROUP BY p.id, p.name, p.code
        ORDER BY "totalQuantitySold" DESC, "totalRevenue" DESC
        LIMIT :limit
      `;

      const results = (await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { companyId, limit },
      })) as BestSellingProduct[];

      return results;
    } catch (error) {
      console.error("Error getting best selling products:", error);
      throw new Error("Failed to retrieve best selling products");
    }
  }

  async getProductsWithHighestStock(
    companyId?: string,
    limit: number = 10
  ): Promise<ProductStock[]> {
    try {
      const whereClause = companyId ? 'WHERE p."companyId" = :companyId' : "";

      const query = `
        SELECT 
          p.id,
          p.name,
          p.code,
          p.type,
          p.price,
          COALESCE(SUM(
            CASE 
              WHEN o.type = 'purchase' THEN oi.quantity
              WHEN o.type IN ('sales', 'transfer') THEN -oi.quantity
              ELSE 0
            END
          ), 0) as "currentStock"
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi."productId" 
          AND oi."deletedAt" IS NULL
        LEFT JOIN orders o ON oi."orderId" = o.id 
          AND o."deletedAt" IS NULL
        ${whereClause}
        AND p."deletedAt" IS NULL
        GROUP BY p.id, p.name, p.code, p.type, p.price
        ORDER BY "currentStock" DESC
        LIMIT :limit
      `;

      const results = (await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { companyId, limit },
      })) as ProductStock[];

      return results;
    } catch (error) {
      console.error("Error getting products with highest stock:", error);
      throw new Error("Failed to retrieve products with highest stock");
    }
  }

  validateProductData(productData: any): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!productData.companyId) {
      errors.push("Company ID is required");
    }

    if (!productData.name || productData.name.trim().length === 0) {
      errors.push("Product name is required");
    }

    if (productData.name && productData.name.length > 255) {
      errors.push("Product name must be less than 255 characters");
    }

    if (!productData.code || productData.code.trim().length === 0) {
      errors.push("Product code is required");
    }

    if (productData.code && productData.code.length > 50) {
      errors.push("Product code must be less than 50 characters");
    }

    if (!productData.price || productData.price <= 0) {
      errors.push("Product price must be greater than zero");
    }

    if (!productData.type || !["solid", "liquid"].includes(productData.type)) {
      errors.push("Valid product type is required (solid or liquid)");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default new ProductService();
