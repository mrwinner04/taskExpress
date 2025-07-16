import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ValidationUtils } from "../Utils/ValidationUtils";

export class UserController {
  static async getAllUsersPerCompany(req: Request, res: Response) {
    try {
      const { companyId } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) {
        return;
      }

      const users = await UserService.getAllUsersPerCompany(companyId);

      return res.status(200).json({
        success: true,
        data: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ValidationUtils.validateRequired(id, "User ID", res)) {
        return;
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: "User retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { companyId, email, name } = req.body;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res))
        return;
      if (!ValidationUtils.validateRequired(email, "Email", res)) return;
      if (!ValidationUtils.validateRequired(name, "Name", res)) return;

      const validation = UserService.validateUserData({
        companyId,
        email,
        name,
      });

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        });
      }

      const emailExists = await UserService.isEmailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      const user = await UserService.createUser({
        companyId,
        email,
        name,
      });

      return res.status(201).json({
        success: true,
        data: user,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email, name } = req.body;

      if (!ValidationUtils.validateRequired(id, "User ID", res)) {
        return;
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (email) {
        const emailExists = await UserService.isEmailExists(email, id);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "User with this email already exists",
          });
        }
      }

      const updatedUser = await UserService.updateUser(id, {
        email,
        name,
      });

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!ValidationUtils.validateRequired(id, "User ID", res)) {
        return;
      }

      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(204).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;

      if (!ValidationUtils.validateRequired(email, "Email", res)) {
        return;
      }

      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
        message: "User retrieved successfully",
      });
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user by email",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getUserCount(req: Request, res: Response) {
    try {
      const { companyId } = req.params;

      if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) {
        return;
      }

      const count = await UserService.getUserCount(companyId);

      return res.status(200).json({
        success: true,
        data: { count },
        message: "User count retrieved successfully",
      });
    } catch (error) {
      console.error("Error getting user count:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to get user count",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
