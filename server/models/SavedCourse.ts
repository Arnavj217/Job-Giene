import mongoose, { Schema, Document } from "mongoose";

export interface ISavedCourse extends Document {
  user_id: mongoose.Types.ObjectId;
  course_id: string;
  saved_at: Date;
}

const SavedCourseSchema = new Schema<ISavedCourse>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course_id: { type: String, required: true },
    saved_at: { type: Date, default: Date.now },
  },
  { collection: "saved_courses" }
);

SavedCourseSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

export const SavedCourse = mongoose.model<ISavedCourse>("SavedCourse", SavedCourseSchema);
