import mongoose, { Schema, Document } from "mongoose";

export interface IRoadmap extends Document {
  title: string;
  description: string;
  category: string;
  skills: string[];
  steps: any[];
  estimated_duration: string;
  user_id: mongoose.Types.ObjectId;
  target_role: string;
  current_skills: string[];
  nodes: any[];
  created_at: Date;
}

const RoadmapSchema = new Schema<IRoadmap>(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    skills: { type: [String], default: [] },
    steps: { type: [Schema.Types.Mixed], default: [] } as any,
    estimated_duration: { type: String, default: "" },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    target_role: { type: String, default: "" },
    current_skills: { type: [String], default: [] },
    nodes: { type: [Schema.Types.Mixed], default: [] } as any,
    created_at: { type: Date, default: Date.now },
  },
  { collection: "roadmaps" }
);

RoadmapSchema.index({ user_id: 1 });

export const Roadmap = mongoose.model<IRoadmap>("Roadmap", RoadmapSchema);
