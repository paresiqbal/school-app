// library
import { Schema, model } from "mongoose";

export interface IClass {
  _id?: string;
  level: string;
  major: string;
}

const ClassSchema = new Schema<IClass>({
  level: {
    type: String,
    required: true,
    enum: ["X", "XI", "XII"],
  },
  major: { type: String, required: true },
});

export const ClassModel = model<IClass>("Class", ClassSchema);
