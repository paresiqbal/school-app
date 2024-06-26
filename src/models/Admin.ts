// library
import { Schema, model } from "mongoose";

export interface IAdmin {
  _id?: string;
  username: string;
  password: string;
  fullname: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
  role: { type: String, default: "admin" },
});

export const AdminModel = model<IAdmin>("Admin", AdminSchema);
