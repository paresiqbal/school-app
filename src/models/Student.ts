// library
import { Schema, model } from "mongoose";

export enum AttendanceStatus {
  Present = "present",
  Absent = "absent",
  Excuse = "excuse",
}

export interface IStudent {
  _id?: string;
  fullname: string;
  username: string;
  password: string;
  nis: number; // Unique student identifier (NIS)
  yearEntry: number;
  avatar?: string; // Optional avatar URL
  role: string;
  class: Schema.Types.ObjectId; // Reference to the Class model
  attendance: {
    [date: string]: AttendanceStatus; // Attendance record for each day
  };
}

const StudentSchema = new Schema<IStudent>({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nis: { type: Number, required: true, unique: true },
  yearEntry: { type: Number, required: true },
  avatar: { type: String },
  role: { type: String, default: "student" },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
  attendance: {
    type: Object,
    default: {},
  },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
