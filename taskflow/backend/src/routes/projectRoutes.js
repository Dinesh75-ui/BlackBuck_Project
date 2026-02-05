import express from "express";
import { getProjects, createProject, updateProject, deleteProject, addMember, removeMember } from "../controllers/projectController.js";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

// All authenticated users can view projects (scoped in controller)
router.get("/", getProjects);

// Only Managers can create/edit/delete
router.post("/", authorizeRoles("MANAGER"), createProject);
router.put("/:id", authorizeRoles("MANAGER"), updateProject);
router.delete("/:id", authorizeRoles("MANAGER"), deleteProject);

// Team Management
router.post("/:id/members", authorizeRoles("MANAGER"), addMember);
router.delete("/:id/members/:userId", authorizeRoles("MANAGER"), removeMember);

export default router;
