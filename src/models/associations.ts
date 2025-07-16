import Company from "../Company/company.model";
import User from "../User/user.model";
import Customer from "../Customer/customer.model";
import Product from "../Products/product.model";
import Warehouse from "../Warehouse/warehouse.model";
import Order from "../Orders/order.model";
import OrderItem from "../Orders/order-item.model";
import Invoice from "../Invoices/invoice.model";

const setupAssociations = () => {
  // Company associations
  Company.hasMany(User, {
    foreignKey: "companyId",
    sourceKey: "id",
    as: "users",
  });

  Company.hasMany(Customer, {
    foreignKey: "companyId",
    sourceKey: "id",
    as: "customers",
  });

  Company.hasMany(Product, {
    foreignKey: "companyId",
    sourceKey: "id",
    as: "products",
  });

  Company.hasMany(Warehouse, {
    foreignKey: "companyId",
    sourceKey: "id",
    as: "warehouses",
  });

  Company.hasMany(Order, {
    foreignKey: "companyId",
    sourceKey: "id",
    as: "orders",
  });

  Company.hasMany(Invoice, {
    foreignKey: "companyId",
    sourceKey: "id",
    as: "invoices",
  });

  // User associations
  User.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    as: "company",
  });

  // Customer associations
  Customer.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    as: "company",
  });

  Customer.hasMany(Order, {
    foreignKey: "customerId",
    sourceKey: "id",
    as: "orders",
  });

  // Product associations
  Product.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    as: "company",
  });

  Product.hasMany(OrderItem, {
    foreignKey: "productId",
    sourceKey: "id",
    as: "orderItems",
  });

  // Warehouse associations
  Warehouse.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    as: "company",
  });

  Warehouse.hasMany(Order, {
    foreignKey: "warehouseId",
    sourceKey: "id",
    as: "orders",
  });

  // Order associations
  Order.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    as: "company",
  });

  Order.belongsTo(Customer, {
    foreignKey: "customerId",
    targetKey: "id",
    as: "customer",
  });

  Order.belongsTo(Warehouse, {
    foreignKey: "warehouseId",
    targetKey: "id",
    as: "warehouse",
  });

  Order.hasMany(OrderItem, {
    foreignKey: "orderId",
    sourceKey: "id",
    as: "orderItems",
  });

  Order.hasOne(Invoice, {
    foreignKey: "orderId",
    sourceKey: "id",
    as: "invoice",
  });

  // OrderItem associations
  OrderItem.belongsTo(Order, {
    foreignKey: "orderId",
    targetKey: "id",
    as: "order",
  });

  OrderItem.belongsTo(Product, {
    foreignKey: "productId",
    targetKey: "id",
    as: "product",
  });

  // Invoice associations
  Invoice.belongsTo(Company, {
    foreignKey: "companyId",
    targetKey: "id",
    as: "company",
  });

  Invoice.belongsTo(Order, {
    foreignKey: "orderId",
    targetKey: "id",
    as: "order",
  });

  // User references
  Company.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });

  Customer.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });

  Product.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });

  Warehouse.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });

  Order.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });

  OrderItem.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });

  Invoice.belongsTo(User, {
    foreignKey: "modifiedBy",
    targetKey: "id",
    as: "modifier",
    constraints: false,
  });
};

setupAssociations();

export {
  Company,
  User,
  Customer,
  Product,
  Warehouse,
  Order,
  OrderItem,
  Invoice,
};

export type { CompanyAttributes } from "../Company/company.model";
export type { UserAttributes } from "../User/user.model";
export type {
  CustomerAttributes,
  CustomerType,
} from "../Customer/customer.model";
export type { ProductAttributes, ProductType } from "../Products/product.model";
export type { WarehouseAttributes } from "../Warehouse/warehouse.model";
export type { OrderAttributes, OrderType } from "../Orders/order.model";
export type { OrderItemAttributes } from "../Orders/order-item.model";
export type { InvoiceAttributes } from "../Invoices/invoice.model";
