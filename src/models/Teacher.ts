// library
import { Schema, model } from "mongoose";

export interface ITeacher {
  _id?: string;
  username: string;
  password: string;
  fullname: string;
  nip: string;
  role: string;
}

const TeacherSchema = new Schema<ITeacher>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  nip: { type: String },
  role: { type: String, default: "teacher" },
});

export const TeacherModel = model<ITeacher>("Teacher", TeacherSchema);
