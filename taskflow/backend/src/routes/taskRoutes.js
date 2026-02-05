import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", getTasks);
router.post("/", authorizeRoles("MANAGER", "ADMIN"), createTask);
router.patch("/:id", updateTask); // User/Manager/Admin
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteTask);

export default router;
