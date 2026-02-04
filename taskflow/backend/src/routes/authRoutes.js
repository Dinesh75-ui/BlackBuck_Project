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

export default router;
