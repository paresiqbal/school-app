// library
import { Schema, model } from "mongoose";

export interface IMajor {
  _id?: string;
  majorName: string;
}

const MajorSchema = new Schema<IMajor>({
  majorName: { type: String, required: true },
});

export const MajorModel = model<IMajor>("Major", MajorSchema);

export interface IClass {
  _id?: string;
  level: string;
  majorId: string;
  majorName: string;
}

const ClassSchema = new Schema<IClass>({
  level: { type: String, required: true, enum: ["X", "XI", "XII"] },
  majorId: { type: String, required: true },
  majorName: { type: String, required: true },
});

export const ClassModel = model<IClass>("Class", ClassSchema);
