import { Schema, model, Types } from "mongoose";

export interface IAttendance {
  _id?: string;
  date: Date;
  student: Types.ObjectId;
  // teacher: Types.ObjectId;
  class: Types.ObjectId;
}

const AttendanceSchema = new Schema<IAttendance>({
  date: { type: Date, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  // teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
});

export const AttendanceModel = model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
