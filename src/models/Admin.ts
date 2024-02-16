// library
import { Schema, model } from "mongoose";

export interface IAdmin {
  _id?: string;
  username: string;
  password: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export default model<IAdmin>("Admin", AdminSchema);
