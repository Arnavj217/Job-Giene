import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  role: string;
  region: string;
  skills: string[];
  interests: string[];
  target_job: string;
  profile_completion: number;
  // Profile fields (embedded for single-document reads)
  domain: string;
  target_country: string;
  experience_level: string;
  profile_image: string;
  cover_image: string;
  phone: string;
  dob: string;
  country: string;
  city: string;
  education: string;
  degree: string;
  college: string;
  career_goals: string;
  preferred_roles: string[];
  preferred_industries: string[];
  // Gamification
  ats_score: number;
  resume_strength: number;
  xp: number;
  streak: number;
  level: number;
  badges: string[];
  completed_tasks: string[];
  completed_nodes: string[];
  last_task_reset_date: string;
  saved_jobs: string[];
  saved_courses: string[];
  completed_courses: string[];
  applications: any[];
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  last_active: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, default: "" },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    region: { type: String, default: "" },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    target_job: { type: String, default: "" },
    profile_completion: { type: Number, default: 0 },
    // Profile
    domain: { type: String, default: "Tech" },
    target_country: { type: String, default: "US" },
    experience_level: { type: String, default: "" },
    profile_image: { type: String, default: "" },
    cover_image: { type: String, default: "" },
    phone: { type: String, default: "" },
    dob: { type: String, default: "" },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    education: { type: String, default: "" },
    degree: { type: String, default: "" },
    college: { type: String, default: "" },
    career_goals: { type: String, default: "" },
    preferred_roles: { type: [String], default: [] },
    preferred_industries: { type: [String], default: [] },
    // Gamification
    ats_score: { type: Number, default: 0 },
    resume_strength: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: { type: [String], default: [] },
    completed_tasks: { type: [String], default: [] },
    completed_nodes: { type: [String], default: [] },
    last_task_reset_date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    saved_jobs: { type: [String], default: [] },
    saved_courses: { type: [String], default: [] },
    completed_courses: { type: [String], default: [] },
    applications: { type: [Schema.Types.Mixed], default: [] } as any,
    // Timestamps
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    last_login: { type: Date, default: Date.now },
    last_active: { type: Date, default: Date.now },
  },
  { timestamps: false, collection: "users" }
);

UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
