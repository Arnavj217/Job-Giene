import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  user_id: mongoose.Types.ObjectId;
  activity_type: string;
  metadata: string;
  timestamp: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    activity_type: { type: String, required: true },
    metadata: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "user_activity" }
);

ActivitySchema.index({ user_id: 1 });
ActivitySchema.index({ activity_type: 1 });
ActivitySchema.index({ timestamp: -1 });

export const Activity = mongoose.model<IActivity>("Activity", ActivitySchema);
