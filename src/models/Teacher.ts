// library
import { Schema, model } from "mongoose";

interface ITeacher {
  _id?: string;
  username: string;
  password: string;
  role: string;
}

const TeacherSchema = new Schema<ITeacher>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "teacher" },
});

export const TeacherModel = model<ITeacher>("Teacher", TeacherSchema);
