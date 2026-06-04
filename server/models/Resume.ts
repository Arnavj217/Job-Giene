import mongoose, { Schema, Document } from "mongoose";

export interface IResume extends Document {
  user_id: mongoose.Types.ObjectId;
  resume_data: any; // Full parsed resume report JSON
  template: string;
  ats_score: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume_data: { type: Schema.Types.Mixed, default: {} },
    template: { type: String, default: "" },
    ats_score: { type: Number, default: 0 },
    download_count: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "resumes" }
);

ResumeSchema.index({ user_id: 1 });

export const Resume = mongoose.model<IResume>("Resume", ResumeSchema);
