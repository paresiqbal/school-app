import { StudentModel } from "../models/Student";
import { ClassModel } from "../models/Class";
import { TeacherModel } from "../models/Teacher";
import { AttendanceModel } from "../models/Attendance";
import { Types } from "mongoose"; // Import Types for ObjectId

export async function attendanceRecord(
  studentId: string,
  teacherId: string,
  classId: string,
  date: Date
) {
  try {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const classExists = await ClassModel.findById(classId);
    if (!classExists) throw new Error("Class not found");

    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) throw new Error("Teacher not found");

    const studentsInClass = await StudentModel.find({
      class: new Types.ObjectId(classId),
    });

    let studentsRecord = [];

    for (const student of studentsInClass) {
      const isInitiatingStudent = student._id.toString() === studentId;
      const status = isInitiatingStudent ? "present" : "absent";

      await new AttendanceModel({
        date: date,
        student: student._id,
        teacher: teacherId,
        class: classId,
        status: status,
      }).save();

      studentsRecord.push({
        id: student._id.toString(),
        fullname: student.fullname,
        class: classExists.level + "-" + classExists.majorName,
        status: status,
      });
    }

    return {
      "attendance-class": classExists.level + "-" + classExists.majorName,
      date: date.toISOString().split("T")[0],
      teacher: teacher.fullname,
      "students-record": studentsRecord,
    };
  } catch (error) {
    console.error("Failed to create attendance records", error);
    throw error;
  }
}
