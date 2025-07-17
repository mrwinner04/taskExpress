import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type OrderType = "sales" | "purchase" | "transfer";

export interface OrderAttributes {
  id: string;
  companyId: string;
  number: string;
  type: OrderType;
  customerId: string;
  warehouseId: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  modifiedBy?: string | null;
}

interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    "id" | "createdAt" | "updatedAt" | "number"
  > {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> {}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "companyId",
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("sales", "purchase", "transfer"),
      allowNull: false,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "customerId",
    },
    warehouseId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "warehouseId",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "updatedAt",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "deletedAt",
    },
    modifiedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "modifiedBy",
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: false,
    paranoid: false,
  }
);

export default Order;
