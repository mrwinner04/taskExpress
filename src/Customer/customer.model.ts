import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export type CustomerType = "customer" | "supplier";

export interface CustomerAttributes {
  id: string;
  companyId: string;
  type: CustomerType;
  name: string;
  email?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  modifiedBy?: string | null;
}

interface CustomerCreationAttributes
  extends Optional<CustomerAttributes, "id" | "createdAt" | "updatedAt"> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> {}

Customer.init(
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
      type: DataTypes.ENUM("customer", "supplier"),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
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
    modelName: "Customer",
    tableName: "customers",
    timestamps: false,
    paranoid: false,
  }
);

export default Customer;
