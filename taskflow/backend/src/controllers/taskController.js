import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get tasks (Admin/Manager sees all in their projects? Or just all? User sees assigned)
export const getTasks = async (req, res) => {
    const { role, id } = req.user;
    const { projectId } = req.query;

    try {
        let whereClause = {};

        if (projectId) {
            whereClause.projectId = projectId;
        }

        if (role === "USER") {
            whereClause.assignedTo = id;
        }
        // if user is manager, check which projects they own
        if (role === "MANAGER") {
            // find projects managed by this user
            const projects = await prisma.project.findMany({
                where: { managerId: id },
                select: { id: true }
            });
            const projectIds = projects.map(p => p.id);

            // If specific projectId requested, check if it belongs to manager
            if (projectId && !projectIds.includes(projectId)) {
                return res.status(403).json({ message: "Access Denied" });
            }

            // If no project filter, limit to owned projects
            if (!projectId) {
                whereClause.projectId = { in: projectIds };
            }
        }

        const tasks = await prisma.task.findMany({
            where: whereClause,
            include: {
                user: { select: { name: true, email: true } },
                project: { select: { name: true } }
            }
        });

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

// Create task (Manager only)
export const createTask = async (req, res) => {
    const { title, description, status, projectId, assignedTo } = req.body;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                status: status || "TODO",
                projectId,
                assignedTo
            },
        });
        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create task" });
    }
};

// Update task status (User can update status, Manager can update all)
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { status, title, description, assignedTo } = req.body;
    const { role, id: userId } = req.user;

    try {
        console.log(`UPDATE TASK: id=${id}, status=${status}, user=${userId}, role=${role}`);
        const task = await prisma.task.findUnique({ where: { id } });

        if (!task) {
            console.log("TASK NOT FOUND");
            return res.status(404).json({ message: "Task not found" });
        }

        // User can only update status of their own tasks
        if (role === "USER") {
            if (task.assignedTo !== userId) {
                console.log(`AUTH DENIED: assignedTo=${task.assignedTo}, actingUser=${userId}`);
                return res.status(403).json({ message: "Not authorized to update this task" });
            }
            // Users can ONLY update status
            if (title || description || assignedTo) {
                return res.status(403).json({ message: "Users can only update task status" });
            }
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: {
                title: role === "MANAGER" || role === "ADMIN" ? title : undefined,
                description: role === "MANAGER" || role === "ADMIN" ? description : undefined,
                assignedTo: role === "MANAGER" || role === "ADMIN" ? assignedTo : undefined,
                status,
            },
            include: {
                user: { select: { name: true, email: true } },
                project: { select: { name: true } }
            }
        });

        console.log("TASK UPDATED SUCCESSFULLY");
        res.json(updatedTask);
    } catch (err) {
        console.error("TASK UPDATE ERROR:", err);
        res.status(500).json({ message: "Failed to update task", error: err.message });
    }
};

// Delete task (Manager only)
export const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.task.delete({
            where: { id },
        });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete task" });
    }
};
