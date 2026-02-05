import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

//  CREATE APP FIRST
const app = express();

// CORS CONFIG
const allowedOrigins = [
  "http://localhost:5173",
  "https://blackbuckassessment.vercel.app",
  process.env.FRONTEND_URL, // Dynamic frontend URL from env
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// BODY PARSERS AFTER CORS
app.use(express.json());
app.use(cookieParser());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("TaskFlow API is running");
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// EXPORT DEFAULT (REQUIRED FOR server.js)
export default app;
