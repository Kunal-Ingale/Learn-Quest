// src/api/convert.ts
import express from "express";
import { handleConvert } from "@/api/controllers/convert/convertController";
import { verifyFirebaseToken } from "@/middleware/firebaseAuth";

const router = express.Router();

router.post("/", verifyFirebaseToken, handleConvert);

export default router;
