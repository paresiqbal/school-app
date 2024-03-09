// library
import { Schema, model } from "mongoose";

export interface IClass {
  _id?: string;
  name: string;
  level: string; // Changed from number to string
  major: string;
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true, unique: true },
  level: {
    type: String,
    required: true,
    enum: ["X", "XI", "XII"], // Updated to Roman numerals
  },
  major: {
    type: String,
    required: true,
    enum: ["TKJ", "TBSM", "TKR", "TITL"],
  },
});

export const ClassModel = model<IClass>("Class", ClassSchema);
