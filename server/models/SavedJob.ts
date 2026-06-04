import mongoose, { Schema, Document } from "mongoose";

export interface ISavedJob extends Document {
  user_id: mongoose.Types.ObjectId;
  job_id: string;
  saved_at: Date;
}

const SavedJobSchema = new Schema<ISavedJob>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    job_id: { type: String, required: true },
    saved_at: { type: Date, default: Date.now },
  },
  { collection: "saved_jobs" }
);

SavedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>("SavedJob", SavedJobSchema);
