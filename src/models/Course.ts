// models/Course.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  userId: string; // 👈 Add user reference
  title: string;
  playlistId: string;
  description: string;
  videoIds: string[];
  createdAt: Date;
  progress: number;        
  currentVideoId: string;
}

const CourseSchema = new Schema<ICourse>({
  userId: { type: String, required: true }, 
  title: { type: String, required: true },
  playlistId: { type: String, required: true },
  description: { type: String, required: true },
  videoIds: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },           
  currentVideoId: { type: String, default: "" }, 
});

const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
