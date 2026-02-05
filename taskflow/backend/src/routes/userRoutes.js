import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", authorizeRoles("ADMIN", "MANAGER"), getAllUsers);
router.post("/", authorizeRoles("ADMIN"), createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
