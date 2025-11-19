import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import type { CorsOptions } from "cors";
import { initializeDatabase } from "./utils/db.js";
import userRoutes from "./routes/userRoutes.js";
import { moodleService } from "./services/moodle/moodleService.js";

dotenv.config();

const app = express();
app.use(express.json());

const defaultOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : defaultOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Health check
app.get("/", (_, res) => {
  res.json({ message: "BridgeLearn Backend (ESM + TypeScript)" });
});

// Moodle health check
app.get("/api/health/moodle", async (_, res) => {
  try {
    const result = await moodleService.testConnection();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to test Moodle connection",
    });
  }
});

// API routes
app.use("/api/users", userRoutes);

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Initialize database schema
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
