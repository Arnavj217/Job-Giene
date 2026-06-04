import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewReport extends Document {
  session_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  overall_score: number;
  communication_score: number;
  confidence_score: number;
  accuracy_score: number;
  fluency: string;
  confidence: string;
  communication: string;
  detailed_evaluation: string;
  strengths: string[];
  weaknesses: string[];
  improvement_areas: string[];
  answers: any[];
  role: string;
  difficulty: string;
  timestamp: Date;
}

const InterviewReportSchema = new Schema<IInterviewReport>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    overall_score: { type: Number, default: 0 },
    communication_score: { type: Number, default: 0 },
    confidence_score: { type: Number, default: 0 },
    accuracy_score: { type: Number, default: 0 },
    fluency: { type: String, default: "" },
    confidence: { type: String, default: "" },
    communication: { type: String, default: "" },
    detailed_evaluation: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    improvement_areas: { type: [String], default: [] },
    answers: { type: [Schema.Types.Mixed], default: [] } as any,
    role: { type: String, default: "" },
    difficulty: { type: String, default: "Medium" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "interview_reports" }
);

InterviewReportSchema.index({ user_id: 1 });
InterviewReportSchema.index({ session_id: 1 });

export const InterviewReport = mongoose.model<IInterviewReport>("InterviewReport", InterviewReportSchema);
