import { Router, Request, Response } from "express";
import UserService from "./user.service";
import {
  validateRequest,
  uuidSchema,
  createUserSchema,
  updateUserSchema,
} from "../utility/zod.schemas";
import { z } from "zod";

const router = Router();

router.get(
  "/company/:companyId",
  validateRequest(z.object({ companyId: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { companyId } = req.params as any;

      const users = await UserService.getAllUsersPerCompany(companyId);

      return res.status(200).json({
        success: true,
        data: users,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.get(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

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
      throw error;
    }
  }
);

router.post(
  "/",
  validateRequest(createUserSchema),
  async (req: Request, res: Response) => {
    try {
      const { companyId, email, name } = req.body;

      const emailExists = await UserService.isEmailExists(email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
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
      throw error;
    }
  }
);

router.put(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  validateRequest(updateUserSchema),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;
      const { email, name } = req.body;

      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Only check email uniqueness if email is provided
      if (email && email.trim()) {
        const emailExists = await UserService.isEmailExists(email, id);
        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      // Only update fields that are provided
      const updateData: any = {};
      if (email && email.trim()) updateData.email = email;
      if (name && name.trim()) updateData.name = name;

      const updatedUser = await UserService.updateUser(id, updateData);

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      throw error;
    }
  }
);

router.delete(
  "/:id",
  validateRequest(z.object({ id: uuidSchema }), "params"),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params as any;

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
      throw error;
    }
  }
);

export default router;
