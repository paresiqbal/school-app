import { Schema, model, Types } from "mongoose";

export interface IAttendance {
  _id?: string;
  date: Date;
  student: Types.ObjectId;
  teacher: Types.ObjectId;
  status: "present" | "sick" | "absent";
}

const AttendanceSchema = new Schema<IAttendance>({
  date: { type: Date, required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  status: {
    type: String,
    enum: ["present", "sick", "absent"],
    required: true,
  },
});

export const AttendanceModel = model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
