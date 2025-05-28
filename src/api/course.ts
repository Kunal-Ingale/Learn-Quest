import express from "express";
import {
  getCourse,
  saveCourse,
  getUserCourses,
} from "./controllers/course/courseController";
import { verifyFirebaseToken } from "@/middleware/firebaseAuth";


const router = express.Router();

router.use(verifyFirebaseToken); // ✅ Firebase Auth

router.post("/", saveCourse);
router.get("/mycourses", getUserCourses);
router.get("/:courseId", getCourse);

// New routes for user progress
// router.get("/:courseId/progress", getUserCourseProgress);


export default router;