import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface OrderItemAttributes {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  modifiedBy?: string | null;
}

interface OrderItemCreationAttributes
  extends Optional<OrderItemAttributes, "id" | "createdAt" | "updatedAt"> {}

class OrderItem extends Model<
  OrderItemAttributes,
  OrderItemCreationAttributes
> {}

OrderItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "orderId",
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "productId",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
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
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: false,
    paranoid: false,
  }
);

export default OrderItem;
