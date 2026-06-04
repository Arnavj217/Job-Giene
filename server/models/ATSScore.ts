import mongoose, { Schema, Document } from "mongoose";

export interface IATSScore extends Document {
  user_id: mongoose.Types.ObjectId;
  ats_score: number;
  resume_score: number;
  keyword_score: number;
  format_score: number;
  experience_score: number;
  generated_at: Date;
}

const ATSScoreSchema = new Schema<IATSScore>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ats_score: { type: Number, required: true, default: 0 },
    resume_score: { type: Number, default: 0 },
    keyword_score: { type: Number, default: 0 },
    format_score: { type: Number, default: 0 },
    experience_score: { type: Number, default: 0 },
    generated_at: { type: Date, default: Date.now },
  },
  { collection: "ats_scores" }
);

ATSScoreSchema.index({ user_id: 1 });

export const ATSScore = mongoose.model<IATSScore>("ATSScore", ATSScoreSchema);
