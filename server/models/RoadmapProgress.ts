import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmapProgress extends Document {
  user_id: mongoose.Types.ObjectId;
  roadmap_id: mongoose.Types.ObjectId;
  completed_steps: string[];
  completion_percentage: number;
  updated_at: Date;
}

const RoadmapProgressSchema = new Schema<IRoadmapProgress>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roadmap_id: { type: Schema.Types.ObjectId, ref: "Roadmap", required: true },
    completed_steps: { type: [String], default: [] },
    completion_percentage: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now },
  },
  { collection: "roadmap_progress" }
);

RoadmapProgressSchema.index({ user_id: 1, roadmap_id: 1 });

export const RoadmapProgress = mongoose.model<IRoadmapProgress>("RoadmapProgress", RoadmapProgressSchema);
