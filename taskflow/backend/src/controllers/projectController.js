import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// get all projects
// admin sees all, manager sees owned/member, user sees member/assigned
export const getProjects = async (req, res) => {
    const { role, id } = req.user;

    try {
        let projects;
        if (role === "ADMIN") {
            projects = await prisma.project.findMany({
                include: {
                    User: { select: { name: true, email: true } },
                    members: { select: { id: true, name: true, email: true } },
                    _count: { select: { tasks: true } }
                }
            });
        } else if (role === "MANAGER") {
            // Managers see projects they manage OR are members of
            projects = await prisma.project.findMany({
                where: {
                    OR: [
                        { managerId: id },
                        { members: { some: { id } } }
                    ]
                },
                include: {
                    User: { select: { name: true, email: true } },
                    members: { select: { id: true, name: true, email: true } },
                    _count: { select: { tasks: true } }
                }
            });
        } else {
            // User sees projects they are member of OR have tasks in
            projects = await prisma.project.findMany({
                where: {
                    OR: [
                        { members: { some: { id } } },
                        { tasks: { some: { assignedTo: id } } }
                    ]
                },
                include: {
                    User: { select: { name: true } },
                    members: { select: { id: true, name: true } }
                }
            });
        }
        res.json(projects);
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Failed to fetch projects" });
    }
};

// Create project (Manager only)
export const createProject = async (req, res) => {
    const { name, description } = req.body;
    const managerId = req.user.id;

    try {
        const project = await prisma.project.create({
            data: {
                name,
                description,
                managerId,
                members: {
                    connect: { id: managerId } // Manager is automatically a member
                }
            },
            include: {
                User: { select: { name: true, email: true } },
                members: { select: { id: true, name: true, email: true } },
                _count: { select: { tasks: true } }
            }
        });
        res.status(201).json(project);
    } catch (err) {
        res.status(500).json({ message: "Failed to create project" });
    }
};

// Update project (Manager only)
export const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const project = await prisma.project.update({
            where: { id },
            data: { name, description },
        });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: "Failed to update project" });
    }
};

// Add Member to Project (Manager only)
export const addMember = async (req, res) => {
    const { id } = req.params; // Project ID
    const { userId } = req.body;

    try {
        const project = await prisma.project.update({
            where: { id },
            data: {
                members: {
                    connect: { id: userId }
                }
            },
            include: { members: true }
        });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add member" });
    }
};

// Remove Member from Project (Manager only)
export const removeMember = async (req, res) => {
    const { id, userId } = req.params; // Project ID, User ID

    try {
        const project = await prisma.project.update({
            where: { id },
            data: {
                members: {
                    disconnect: { id: userId }
                }
            }
        });
        res.json({ message: "Member removed" });
    } catch (err) {
        res.status(500).json({ message: "Failed to remove member" });
    }
};

// Delete project (Manager only)
export const deleteProject = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.project.delete({
            where: { id },
        });
        res.json({ message: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete project" });
    }
};
