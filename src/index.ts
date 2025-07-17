import express, { Request, Response, Application } from "express";
import mainRouter from "./routes/mainRoutes";
import { testConnection } from "./config/database";
import "./config/associations";

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

const startServer = async (): Promise<void> => {
  try {
    await testConnection();

    app.listen(PORT, (): void => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Local: http://localhost:${PORT}`);
      console.log(`🌟 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("💥 Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();

export default app;
