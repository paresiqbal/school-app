// library
import { Schema, model } from "mongoose";

export interface IStudent {
  _id?: string;
  username: string;
  password: string;
  role: string;
  qrcode: string;
  avatar?: string;
  nis: number;
  fullName: string;
  yearEntry: number;
}

const StudentSchema = new Schema<IStudent>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  qrcode: { type: String, unique: true },
  role: { type: String, default: "student" },
  fullName: { type: String, required: true },
  avatar: { type: String },
  nis: { type: Number, required: true },
  yearEntry: { type: Number, required: true },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
