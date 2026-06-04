import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  user_id: mongoose.Types.ObjectId;
  conversation_id: string;
  question: string;
  response: string;
  role: string;
  content: string;
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    conversation_id: { type: String, required: true },
    question: { type: String, default: "" },
    response: { type: String, default: "" },
    role: { type: String, default: "" },
    content: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "chat_messages" }
);

ChatMessageSchema.index({ user_id: 1, conversation_id: 1 });

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
