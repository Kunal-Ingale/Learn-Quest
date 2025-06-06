import express from "express";
import {
  getCourse,
  saveCourse,
  getUserCourses,
  updateCourseProgress,
  getCourseProgress,
  deleteCourse,
} from "./controllers/course/courseController";
import { verifyFirebaseToken } from "@/middleware/firebaseAuth";

const router = express.Router();

router.use(verifyFirebaseToken); // ✅ Firebase Auth

router.post("/", saveCourse);
router.get("/mycourses", getUserCourses);
router.get("/:courseId", getCourse);
router.patch("/:courseId/progress", updateCourseProgress);
router.get("/:courseId/progress", getCourseProgress);
router.delete("/:courseId", deleteCourse);

export default router;