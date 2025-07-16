import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { ProductType } from "../Products/product.model";

export interface WarehouseAttributes {
  id: string;
  companyId: string;
  type?: ProductType | null;
  name: string;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  modifiedBy?: string | null;
}

interface WarehouseCreationAttributes
  extends Optional<WarehouseAttributes, "id" | "createdAt" | "updatedAt"> {}

class Warehouse extends Model<
  WarehouseAttributes,
  WarehouseCreationAttributes
> {}

Warehouse.init(
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
    type: {
      type: DataTypes.ENUM("solid", "liquid"),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: "Warehouse",
    tableName: "warehouses",
    timestamps: false,
    paranoid: false,
  }
);

export default Warehouse;
