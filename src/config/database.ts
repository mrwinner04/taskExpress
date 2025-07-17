import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), "database.env") });

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  dialect: "postgres";
}

const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME || "postgres",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  dialect: "postgres",
};

const sequelize = new Sequelize(
  databaseConfig.database,
  databaseConfig.username,
  databaseConfig.password,
  {
    host: databaseConfig.host,
    port: databaseConfig.port,
    dialect: databaseConfig.dialect,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      paranoid: true,
      underscored: false,
      timestamps: true,
    },
  }
);

export const testConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    throw error;
  }
};

export const syncDatabase = async (force: boolean = false): Promise<void> => {
  try {
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ force });
      console.log("🔄 Database synchronized successfully");
    } else {
      console.log("📊 Using migrations for database schema management");
    }
  } catch (error) {
    console.error("❌ Database sync failed:", error);
    throw error;
  }
};

export default sequelize;
