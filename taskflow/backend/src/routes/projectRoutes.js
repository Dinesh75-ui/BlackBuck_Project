import express from "express";
import { getProjects, createProject, updateProject, deleteProject, addMember, removeMember } from "../controllers/projectController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// All authenticated users can view projects (scoped in controller)
router.get("/", getProjects);

// Only Managers/Admins can create/edit/delete
router.post("/", authorizeRoles("MANAGER", "ADMIN"), createProject);
router.put("/:id", authorizeRoles("MANAGER", "ADMIN"), updateProject);
router.delete("/:id", authorizeRoles("MANAGER", "ADMIN"), deleteProject);

// Team Management
router.post("/:id/members", authorizeRoles("MANAGER", "ADMIN"), addMember);
router.delete("/:id/members/:userId", authorizeRoles("MANAGER", "ADMIN"), removeMember);

export default router;
