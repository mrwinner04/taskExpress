import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface CompanyAttributes {
  id: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  modifiedBy?: string | null;
}

interface CompanyCreationAttributes
  extends Optional<CompanyAttributes, "id" | "createdAt" | "updatedAt"> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> {}

Company.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    modelName: "Company",
    tableName: "companies",
    timestamps: false,
    paranoid: false,
  }
);

export default Company;
