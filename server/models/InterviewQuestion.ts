import mongoose, { Schema, Document } from "mongoose";

export interface IInterviewQuestion extends Document {
  session_id: mongoose.Types.ObjectId;
  question: string;
}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    session_id: { type: Schema.Types.ObjectId, ref: "InterviewSession", required: true },
    question: { type: String, required: true },
  },
  { collection: "interview_questions" }
);

InterviewQuestionSchema.index({ session_id: 1 });

export const InterviewQuestion = mongoose.model<IInterviewQuestion>("InterviewQuestion", InterviewQuestionSchema);
