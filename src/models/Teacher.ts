// library
import { Schema, model } from "mongoose";

interface ITeacher {
  _id?: string;
  username: string;
  password: string;
}

const StudentSchema = new Schema<ITeacher>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<ITeacher>("Student", StudentSchema);
