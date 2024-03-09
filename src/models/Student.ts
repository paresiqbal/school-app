// library
import { Schema, model } from "mongoose";

export interface IStudent {
  _id?: string;
  fullname: string;
  username: string;
  password: string;
  nis: number;
  yearEntry: number;
  class: { type: Schema.Types.ObjectId; ref: "Class"; required: true };
  avatar?: string;
  role: string;
}

const StudentSchema = new Schema<IStudent>({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nis: { type: Number, required: true, unique: true },
  yearEntry: { type: Number, required: true },
  avatar: { type: String },
  role: { type: String, default: "student" },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
