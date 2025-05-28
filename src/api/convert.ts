// src/api/convert/index.ts
import express from "express";
import { handleConvert } from "./controllers/convert/convertController";
import { verifyFirebaseToken } from "@/middleware/firebaseAuth";

const router = express.Router();

// Add Firebase Auth middleware
router.post("/", verifyFirebaseToken, handleConvert);

export default router;
