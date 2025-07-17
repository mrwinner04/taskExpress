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
}
