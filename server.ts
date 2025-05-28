// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import convert from "./src/api/convert";
import course from "./src/api/course";



dotenv.config();

const app = express();
const PORT = 5000;
app.options("*", cors());
app.use(cors({
  origin: ["http://localhost:3001","http://localhost:3000","http://localhost:8080",], // Allow both Vite default port and your frontend port
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

const MONGODB_URI = process.env.MONGO_URL;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/convert", convert);
app.use("/api/course", course);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
