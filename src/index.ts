import express, { Request, Response, Application } from "express";
import mainRouter from "./route/mainRoutes";
import { testConnection } from "./config/database";
import sequelize from "./config/database";
import "./config/associations";
import { errorHandler } from "./middleware/error.handler";

const app: Application = express();

const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", mainRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "TaskExpress API - Warehouse Management System",
    description: "Complete warehouse management system ",
  });
});

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await testConnection();

    const server = app.listen(PORT, (): void => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌟 Environment: ${process.env.NODE_ENV}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Gracefully shutting down...");

      server.close(() => {
        console.log("✅ HTTP server closed.");
        sequelize
          .close()
          .then(() => {
            console.log("✅ Database connection closed.");
            process.exit(0);
          })
          .catch((error) => {
            console.error("❌ Error closing database connection:", error);
            process.exit(1);
          });
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    process.on("uncaughtException", (error) => {
      console.error("💥 Uncaught Exception:", error);
      shutdown();
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
      shutdown();
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();

export default app;
