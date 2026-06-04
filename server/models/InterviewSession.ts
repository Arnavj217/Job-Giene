import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewSession extends Document {
  user_id: mongoose.Types.ObjectId;
  domain: string;
  difficulty: string;
  question_count: number;
  timestamp: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    domain: { type: String, required: true },
    difficulty: { type: String, required: true },
    question_count: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "interview_sessions" }
);

InterviewSessionSchema.index({ user_id: 1 });

export const InterviewSession = mongoose.model<IInterviewSession>("InterviewSession", InterviewSessionSchema);
