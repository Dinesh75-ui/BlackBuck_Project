import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", authorizeRoles("ADMIN", "MANAGER"), getAllUsers);
router.post("/", authorizeRoles("ADMIN"), createUser);
router.put("/:id", authorizeRoles("ADMIN"), updateUser);
router.delete("/:id", authorizeRoles("ADMIN"), deleteUser);

export default router;
