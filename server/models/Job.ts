import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  salary: string;
  job_type: string;
  skills_required: string[];
  description: string;
  application_link: string;
  status: string;
  domain: string;
  remote: boolean;
  usd_min_salary: number;
  usd_max_salary: number;
  created_at: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: "Remote" },
    salary: { type: String, default: "" },
    job_type: { type: String, default: "Job" },
    skills_required: { type: [String], default: [] },
    description: { type: String, default: "" },
    application_link: { type: String, default: "#apply" },
    status: { type: String, default: "active" },
    domain: { type: String, default: "Tech" },
    remote: { type: Boolean, default: false },
    usd_min_salary: { type: Number, default: 0 },
    usd_max_salary: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "jobs" }
);

export const Job = mongoose.model<IJob>("Job", JobSchema);
