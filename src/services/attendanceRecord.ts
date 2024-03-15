import { StudentModel } from "../models/Student";
import { ClassModel } from "../models/Class";
import { TeacherModel } from "../models/Teacher";
import { AttendanceModel } from "../models/Attendance";
import { Types } from "mongoose"; // Import Types for ObjectId

export async function attendanceRecord(
  teacherId: string,
  classId: string,
  date: Date | string,
  studentId: string // Add this parameter
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

    // Modify the mapping to check if the current student is the initiating student
    const attendanceRecords = studentsInClass.map((student) => ({
      date: date,
      student: student._id,
      teacher: teacherId,
      class: classId,
      status: student._id.toString() === studentId ? "present" : "absent", // Check if the student is the initiator
    }));

    await AttendanceModel.insertMany(attendanceRecords);

    let studentsRecord = attendanceRecords.map((record) => ({
      id: record.student.toString(),
      fullname: studentsInClass.find(
        (s) => s._id.toString() === record.student.toString()
      )?.fullname,
      class: classExists.level + "-" + classExists.majorName,
      status: record.status,
    }));

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
