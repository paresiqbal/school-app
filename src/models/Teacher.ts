// library
import { Schema, model } from "mongoose";

export interface ITeacher {
  _id?: string;
  username: string;
  password: string;
  avatar?: string;
  fullName: string;
  nip: string;
  role: string;
}

const TeacherSchema = new Schema<ITeacher>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  fullName: { type: String, required: true },
  nip: { type: String },
  role: { type: String, default: "teacher" },
});

export const TeacherModel = model<ITeacher>("Teacher", TeacherSchema);
