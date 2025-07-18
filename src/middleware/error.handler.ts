import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error Handler:", err);

  if (err instanceof ZodError) {
    const errors = (err as any).errors.map((error: any) => ({
      field: error.path.join("."),
      message: error.message,
    }));

    return next({
      success: false,
      message: "Validation failed",
      errors,
      statusCode: 400,
    });
  }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const errors = err.errors.map((error: any) => ({
      field: error.path,
      message: error.message,
    }));

    return next({
      success: false,
      message: "Database validation failed",
      errors,
      statusCode: 400,
    });
  }

  return next({
    success: false,
    message: err.message || "Internal server error",
    statusCode: err.statusCode || 500,
  });
}

export function finalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Final Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors,
    timestamp: new Date().toISOString(),
  });
}
