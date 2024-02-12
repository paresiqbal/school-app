// library
import { Schema, model } from "mongoose";

interface IStudent {
  _id?: string;
  username: string;
  password: string;
  barcode: string;
  //   bio: {};
}

const StudentSchema = new Schema<IStudent>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  barcode: { type: String, required: true },
  //   bio: { type: Object, required: true },
});

export default model<IStudent>("Student", StudentSchema);
