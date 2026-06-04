import mongoose, { Schema, Document } from "mongoose";

export interface IAdminLog extends Document {
  admin_id: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  ip_address: string;
  timestamp: Date;
}

const AdminLogSchema = new Schema<IAdminLog>(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    resource: { type: String, default: "" },
    ip_address: { type: String, default: "127.0.0.1" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "admin_logs" }
);

AdminLogSchema.index({ admin_id: 1 });
AdminLogSchema.index({ timestamp: -1 });

export const AdminLog = mongoose.model<IAdminLog>("AdminLog", AdminLogSchema);
