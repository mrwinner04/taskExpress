import Product, { ProductAttributes, ProductType } from "./product.model";

export class ProductService {
  static async getAllProducts(companyId: string): Promise<Product[]> {
    return await Product.findAll({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getProductById(id: string): Promise<Product | null> {
    return await Product.findByPk(id);
  }

  static async createProduct(productData: {
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

  static async updateProduct(
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

  static async deleteProduct(id: string): Promise<boolean> {
    const product = await Product.findByPk(id);
    if (!product) {
      return false;
    }

    await product.update({
      deletedAt: new Date(),
    });

    return true;
  }

  static async getProductsByType(
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

  static async searchProducts(
    companyId: string,
    searchTerm: string
  ): Promise<Product[]> {
    return await Product.findAll({
      where: {
        companyId: companyId,
        [require("sequelize").Op.or]: [
          {
            name: {
              [require("sequelize").Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            code: {
              [require("sequelize").Op.iLike]: `%${searchTerm}%`,
            },
          },
        ],
        deletedAt: null,
      },
      order: [["name", "ASC"]],
    });
  }

  static async getProductsByPriceRange(
    companyId: string,
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> {
    return await Product.findAll({
      where: {
        companyId: companyId,
        price: {
          [require("sequelize").Op.between]: [minPrice, maxPrice],
        },
        deletedAt: null,
      },
      order: [["price", "ASC"]],
    });
  }

  static async getProductCount(companyId: string): Promise<number> {
    return await Product.count({
      where: {
        companyId: companyId,
        deletedAt: null,
      },
    });
  }

  static async getProductCountByType(
    companyId: string,
    type: ProductType
  ): Promise<number> {
    return await Product.count({
      where: {
        companyId: companyId,
        type,
        deletedAt: null,
      },
    });
  }

  static async isProductCodeExists(
    companyId: string,
    code: string,
    excludeId?: string
  ): Promise<boolean> {
    const whereClause: any = {
      companyId: companyId,
      code,
      deletedAt: null,
    };

    if (excludeId) {
      whereClause.id = {
        [require("sequelize").Op.ne]: excludeId,
      };
    }

    const count = await Product.count({ where: whereClause });
    return count > 0;
  }

  static validateProductData(productData: any): {
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
