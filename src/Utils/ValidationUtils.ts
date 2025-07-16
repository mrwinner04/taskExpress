import { Response } from "express";

export class ValidationUtils {
  static validateRequired(
    value: string | undefined,
    fieldName: string,
    res: Response
  ): value is string {
    if (!value) {
      res.status(400).json({
        success: false,
        message: `${fieldName} is required`,
      });
      return false;
    }
    return true;
  }

  static validateBodyRequired(
    value: string | undefined,
    fieldName: string,
    res: Response
  ): value is string {
    if (!value || value.trim().length === 0) {
      res.status(400).json({
        success: false,
        message: `${fieldName} is required`,
      });
      return false;
    }
    return true;
  }

  static validateUUID(
    uuid: string | undefined,
    fieldName: string,
    res: Response
  ): uuid is string {
    if (!this.validateRequired(uuid, fieldName, res)) {
      return false;
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      res.status(400).json({
        success: false,
        message: `${fieldName} must be a valid UUID`,
      });
      return false;
    }
    return true;
  }

  static validateEmail(
    email: string | undefined,
    fieldName: string,
    res: Response
  ): email is string {
    if (!this.validateRequired(email, fieldName, res)) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: `${fieldName} must be a valid email address`,
      });
      return false;
    }
    return true;
  }
}
