// library
import { Schema, model } from "mongoose";

export interface IStudent {
  _id?: string;
  fullname: string;
  username: string;
  password: string;
  nis: number;
  yearEntry: number;
  role: string;
  class: Schema.Types.ObjectId;
}

const StudentSchema = new Schema<IStudent>({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nis: { type: Number, required: true, unique: true },
  yearEntry: { type: Number, required: true },
  role: { type: String, default: "student" },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
