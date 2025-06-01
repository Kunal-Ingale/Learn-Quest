import express from "express";
import {
  getCourse,
  saveCourse,
  getUserCourses,
  updateCourseProgress,
  getCourseProgress,
} from "./controllers/course/courseController";
import { verifyFirebaseToken } from "@/middleware/firebaseAuth";



const router = express.Router();

router.use(verifyFirebaseToken); // ✅ Firebase Auth

router.post("/", saveCourse);
router.get("/mycourses", getUserCourses);
router.get("/:courseId", getCourse);
router.patch("/:courseId/progress", updateCourseProgress);
router.get("/:courseId/progress", getCourseProgress);



export default router;