// library
import { Schema, model } from "mongoose";

export interface IMajor {
  _id?: Schema.Types.ObjectId;
  major: string;
}

const MajorSchema = new Schema<IMajor>({
  major: { type: String, required: true },
});

export const MajorModel = model<IMajor>("Major", MajorSchema);

export interface IClass {
  _id?: Schema.Types.ObjectId;
  level: string;
  major: Schema.Types.ObjectId;
}

const ClassSchema = new Schema<IClass>({
  level: {
    type: String,
    required: true,
    enum: ["X", "XI", "XII"],
  },
  major: { type: Schema.Types.ObjectId, required: true, ref: "Major" },
});

export const ClassModel = model<IClass>("Class", ClassSchema);
