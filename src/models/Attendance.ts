import { Schema, model, Types } from "mongoose";

export interface IAttendance {
  _id?: string;
  date: Date;
  class: Types.ObjectId;
  teacher: Types.ObjectId;
  subject: string;
  timestamp: Date;
  students: {
    id: Types.ObjectId;
    fullname: string;
    class: Types.ObjectId;
    isPresent: string;
  }[];
}

const AttendanceSchema = new Schema<IAttendance>({
  date: { type: Date, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  subject: { type: String, required: true },
  timestamp: { type: Date, required: true },
  students: [
    {
      id: { type: Schema.Types.ObjectId, ref: "Student" },
      fullname: { type: String, required: true },
      class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
      isPresent: {
        type: String,
        enum: ["absent", "present", "excuse"],
        default: "absent",
      },
    },
  ],
});

export const AttendanceModel = model<IAttendance>(
  "Attendance",
  AttendanceSchema
);
