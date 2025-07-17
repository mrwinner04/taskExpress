import {
  Product,
  ProductAttributes,
  ProductType,
} from "../config/associations";

class ProductService {
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
