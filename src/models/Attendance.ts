import { Schema, model, Types } from "mongoose";

interface IAttendance {
  _id?: string;
  date: Date;
  student: Types.ObjectId;
  teacher: Types.ObjectId;
  class: Types.ObjectId;
  isPresent: "present" | "absent" | "excused";
  timestamp?: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  date: { type: Date, required: true, index: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  isPresent: {
    type: String,
    required: true,
    enum: ["present", "absent", "excused"],
    default: "absent",
  },
  timestamp: { type: Date, index: true },
});

export const AttendanceModel = model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
