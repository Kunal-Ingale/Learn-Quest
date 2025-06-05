import 'module-alias/register';
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import next from "next";
import convert from "./src/api/convert";
import course from "./src/api/course";

dotenv.config();

const PORT = parseInt(process.env.PORT || "5000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGODB_URI = process.env.MONGO_URL;
if (!MONGODB_URI) throw new Error("MONGO_URL not defined in .env");

app.prepare().then(() => {
  const server = express();

  server.use(cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8080",
      "https://learnquest-ng5h.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  server.use(express.json());

  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

  // Express routes
  server.use("/api/convert", convert);
  server.use("/api/course", course);

  // Handle Next.js pages
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    //console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
