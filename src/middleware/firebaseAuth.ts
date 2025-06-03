import { Request, Response, NextFunction } from "express";
import admin from "@/utils/firebase";

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No valid authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  // console.log("🎫 Token length:", idToken.length);

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    // console.log("✅ Token verified for user:", decodedToken.uid);
    // console.log("📧 User email:", decodedToken.email);
    
    req.user = decodedToken;
    next();
  } catch (err: any) {
    console.error("❌ Firebase auth failed:", {
      code: err.code,
      message: err.message
    });
    
    // More specific error messages
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: "Token expired" });
    } else if (err.code === 'auth/argument-error') {
      return res.status(401).json({ error: "Invalid token format" });
    }
    
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
