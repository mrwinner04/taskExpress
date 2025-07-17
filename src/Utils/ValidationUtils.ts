import { Response } from "express";

export interface ValidationField {
  value: any;
  fieldName: string;
}

export class ValidationUtils {
  static validateRequiredFields(
    fields: ValidationField[],
    res: Response
  ): boolean {
    for (const field of fields) {
      if (!field.value) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
        });
        return false;
      }
    }
    return true;
  }

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

  static validateUUID(value: string, res: Response): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
      });
      return false;
    }
    return true;
  }

  static validatePositiveNumber(value: number, res: Response): boolean {
    if (typeof value !== "number" || value <= 0) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
      });
      return false;
    }
    return true;
  }
}
