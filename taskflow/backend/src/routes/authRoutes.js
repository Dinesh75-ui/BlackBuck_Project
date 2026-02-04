import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import { protect, roleCheck } from "../middleware/authMiddleware.js";

const router = express.Router();

// LOGIN (ALL ROLES)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
  httpOnly: true,
  secure: false,      
  sameSite: "lax",
});

  res.json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

// REGISTER (ADMIN ONLY)
router.post("/register", protect, roleCheck("ADMIN"), async (req, res) => {
  const { name, email, password, role } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role,
    },
  });

  res.json(user);
});

// TEMPORARY: SEED ADMIN USER (DELETE AFTER USE)
router.post("/seed-admin", async (req, res) => {
  console.log("SEED ADMIN ROUTE HIT");

  const hashed = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com",
      password: hashed,
      role: "ADMIN",
    },
  });

  res.json(admin);
});

// TEMPORARY: SEED MANAGER USER (DELETE AFTER USE)
router.post("/seed-manager", async (req, res) => {
  console.log("SEED MANAGER ROUTE HIT");

  const existing = await prisma.user.findUnique({
    where: { email: "manager@test.com" },
  });

  if (existing) {
    return res.json({ message: "Manager already exists" });
  }

  const hashed = await bcrypt.hash("password123", 10);

  const manager = await prisma.user.create({
    data: {
      name: "Manager",
      email: "manager@test.com",
      password: hashed,
      role: "MANAGER",
    },
  });

  res.json(manager);
});

// TEMPORARY: SEED USER (DELETE AFTER USE)
router.post("/seed-user", async (req, res) => {
  console.log("SEED USER ROUTE HIT");

  const existing = await prisma.user.findUnique({
    where: { email: "user@test.com" },
  });

  if (existing) {
    return res.json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "User",
      email: "user@test.com",
      password: hashed,
      role: "USER",
    },
  });

  res.json(user);
});



export default router;
