import express, { Request, Response, NextFunction, Application } from "express";
import todosRouter from "./routes/todos.js";

const app: Application = express();

const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/todos", todosRouter);

// Start the server
app.listen(PORT, (): void => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
  console.log(`🌟 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Export the app for testing purposes
export default app;
