import { Router, Request, Response } from "express";
import UserService from "./user.service";
import { ValidationUtils, ValidationField } from "../utility/ValidationUtils";

const router = Router();

router.get("/company/:companyId", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) {
      return;
    }

    const users = await UserService.getAllUsersPerCompany(companyId as string);

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "User ID", res)) {
      return;
    }

    const user = await UserService.getUserById(id as string);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
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
      message: "Invalid",
    });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { companyId, email, name } = req.body;

    // Validate required fields using the new validation method
    const validationFields: ValidationField[] = [
      { value: companyId, fieldName: "Company ID" },
      { value: email, fieldName: "Email" },
      { value: name, fieldName: "Name" },
    ];

    if (!ValidationUtils.validateRequiredFields(validationFields, res)) return;

    const validation = UserService.validateUserData({
      companyId,
      email,
      name,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
      });
    }

    const emailExists = await UserService.isEmailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
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
      message: "Invalid",
    });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!ValidationUtils.validateRequired(id, "User ID", res)) {
      return;
    }

    const user = await UserService.getUserById(id as string);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
      });
    }

    if (email) {
      const emailExists = await UserService.isEmailExists(email, id as string);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
        });
      }
    }

    const updatedUser = await UserService.updateUser(id as string, {
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
      message: "Invalid",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!ValidationUtils.validateRequired(id, "User ID", res)) {
      return;
    }

    const deleted = await UserService.deleteUser(id as string);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
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
      message: "Invalid",
    });
  }
});

router.get("/email/:email", async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!ValidationUtils.validateRequired(email, "Email", res)) {
      return;
    }

    const user = await UserService.getUserByEmail(email as string);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid",
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
      message: "Invalid",
    });
  }
});

router.get("/company/:companyId/count", async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!ValidationUtils.validateRequired(companyId, "Company ID", res)) {
      return;
    }

    const count = await UserService.getUserCount(companyId as string);

    return res.status(200).json({
      success: true,
      data: { count },
      message: "User count retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting user count:", error);
    return res.status(500).json({
      success: false,
      message: "Invalid",
    });
  }
});

export default router;
