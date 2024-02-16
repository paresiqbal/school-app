// library
import { Schema, model } from "mongoose";

export interface IStudent {
  _id?: string;
  username: string;
  password: string;
  role: string;
  barcode?: string;
  //   bio: {};
}

const StudentSchema = new Schema<IStudent>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  barcode: { type: String },
  role: { type: String, default: "student" },
  //   bio: { type: Object, required: true },
});

export const StudentModel = model<IStudent>("Student", StudentSchema);
