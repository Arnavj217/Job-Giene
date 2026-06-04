import mongoose, { Schema, Document } from "mongoose";

export interface ICoverLetter extends Document {
  user_id: mongoose.Types.ObjectId;
  company_name: string;
  job_title: string;
  skills: string[];
  generated_letter: string;
  created_at: Date;
}

const CoverLetterSchema = new Schema<ICoverLetter>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    company_name: { type: String, required: true },
    job_title: { type: String, required: true },
    skills: { type: [String], default: [] },
    generated_letter: { type: String, default: "" },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "cover_letters" }
);

CoverLetterSchema.index({ user_id: 1 });

export const CoverLetter = mongoose.model<ICoverLetter>("CoverLetter", CoverLetterSchema);
