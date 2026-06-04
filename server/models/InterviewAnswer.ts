import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewAnswer extends Document {
  session_id: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  score: number;
  feedback: string;
  communication: number;
  confidence: number;
  technical_accuracy: number;
  is_correct: boolean;
}

const InterviewAnswerSchema = new Schema<IInterviewAnswer>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true },
    question: { type: String, default: "" },
    answer: { type: String, default: "" },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: "" },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    technical_accuracy: { type: Number, default: 0 },
    is_correct: { type: Boolean, default: false },
  },
  { collection: "interview_answers" }
);

InterviewAnswerSchema.index({ session_id: 1 });

export const InterviewAnswer = mongoose.model<IInterviewAnswer>("InterviewAnswer", InterviewAnswerSchema);
