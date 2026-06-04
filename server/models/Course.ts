import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  provider: string;
  duration: string;
  level: string;
  skills: string[];
  course_url: string;
  status: string;
  instructor: string;
  rating: number;
  domain: string;
  type: string;
  learners: string;
  certificate: string;
  sub_domain: string;
  created_at: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    provider: { type: String, default: "" },
    duration: { type: String, default: "" },
    level: { type: String, default: "Beginner" },
    skills: { type: [String], default: [] },
    course_url: { type: String, default: "" },
    status: { type: String, default: "active" },
    instructor: { type: String, default: "" },
    rating: { type: Number, default: 4.5 },
    domain: { type: String, default: "Tech" },
    type: { type: String, default: "Course" },
    learners: { type: String, default: "" },
    certificate: { type: String, default: "" },
    sub_domain: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "courses" }
);

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
