// library
import { Schema, model } from "mongoose";

export interface IClass {
  _id?: string;
  name: string;
  classCode: string;
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true, unique: true },
  classCode: { type: String, required: true, unique: true },
});

export const ClassModel = model<IClass>("Class", ClassSchema);
