import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get("/company/:companyId", UserController.getAllUsersPerCompany);

router.get("/email/:email", UserController.getUserByEmail);

router.get("/:id", UserController.getUserById);

router.post("/", UserController.createUser);

router.put("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

router.get("/company/:companyId/count", UserController.getUserCount);

export default router;
