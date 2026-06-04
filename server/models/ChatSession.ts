import mongoose, { Schema, Document } from "mongoose";

export interface IChatSession extends Document {
  user_id: mongoose.Types.ObjectId;
  conversation_id: string;
  title: string;
  timestamp: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conversation_id: { type: String, required: true },
    title: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "chat_sessions" }
);

ChatSessionSchema.index({ user_id: 1 });
ChatSessionSchema.index({ conversation_id: 1 });

export const ChatSession = mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
