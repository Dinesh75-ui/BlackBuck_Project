import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// Create a new user (Admin only)
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "USER",
            },
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to create user" });
    }
};

// Update user (Admin only)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: { name, email, role },
        });
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Failed to update user" });
    }
};

// Delete a user (Admin only)
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id },
        });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete user" });
    }
};
