import { Response } from "express";

export class ValidationUtils {
  static validateRequired(
    value: any,
    fieldName: string,
    res: Response
  ): boolean {
    if (!value) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
      });
      return false;
    }
    return true;
  }
}
