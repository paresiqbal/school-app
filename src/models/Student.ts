// library
import { Schema, Types, model } from "mongoose";

export interface IStudent {
  _id?: string;
  fullname: string;
  username: string;
  password: string;
  nis: number;
  avatar?: string;
  role: string;
  yearEntry: number;
  class: Types.ObjectId | string;
  attendanceStatus?: AttendanceStatus;
}

export enum AttendanceStatus {
  Present = "present",
  Absent = "absent",
  Excuse = "excuse",
}

const StudentSchema = new Schema<IStudent>({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nis: { type: Number, required: true, unique: true },
  yearEntry: { type: Number, required: true },
  avatar: { type: String },
  role: { type: String, default: "student" },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
  },
  attendanceStatus: {
    type: String,
    enum: ["present", "excuse", "absent"],
    default: null,
  },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
