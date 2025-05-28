// models/Course.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  userId: string; // 👈 Add user reference
  title: string;
  playlistId: string;
  description: string;
  videoIds: string[];
  createdAt: Date;
}

const CourseSchema = new Schema<ICourse>({
  userId: { type: String, required: true }, // 👈 Required user field
  title: { type: String, required: true },
  playlistId: { type: String, required: true },
  description: { type: String, required: true },
  videoIds: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
});

const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
