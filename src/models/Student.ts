// library
import { Schema, model } from "mongoose";

export interface IStudent {
  _id?: string;
  username: string;
  password: string;
  role: string;
  avatar?: string;
  nis: number;
  fullname: string;
  yearEntry: number;
}

const StudentSchema = new Schema<IStudent>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student" },
  fullname: { type: String, required: true },
  avatar: { type: String },
  nis: { type: Number, required: true, unique: true },
  yearEntry: { type: Number, required: true },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
