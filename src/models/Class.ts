// library
import { Schema, model } from "mongoose";

export interface IClass {
  _id?: string;
  name: string; // Full class name (e.g., X TKJ, XI TBSM)
  level: number; // Integer representing level (1: X, 2: XI, 3: XII)
  major: string; // String representing major (TKJ, TBSM, TKR, TITL)
}

const ClassSchema = new Schema<IClass>({
  name: { type: String, required: true, unique: true },
  level: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // Enforce valid levels: 1, 2, or 3
  },
  major: {
    type: String,
    required: true,
    enum: ["TKJ", "TBSM", "TKR", "TITL"], // Enforce valid majors
  },
});

export const ClassModel = model<IClass>("Class", ClassSchema);
