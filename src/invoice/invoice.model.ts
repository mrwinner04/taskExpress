import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface InvoiceAttributes {
  id: string;
  companyId: string;
  orderId: string;
  number: string;
  date: Date;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  modifiedBy?: string | null;
}

interface InvoiceCreationAttributes
  extends Optional<
    InvoiceAttributes,
    "id" | "createdAt" | "updatedAt" | "number" | "status"
  > {}

class Invoice extends Model<InvoiceAttributes, InvoiceCreationAttributes> {}

Invoice.init(
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
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "orderId",
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
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
    modelName: "Invoice",
    tableName: "invoices",
    timestamps: false,
    paranoid: false,
  }
);

export default Invoice;
