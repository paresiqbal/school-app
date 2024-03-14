import { StudentModel } from "../models/Student";
import { ClassModel } from "../models/Class";
import { TeacherModel } from "../models/Teacher";
import { AttendanceModel } from "../models/Attendance";
import { Types } from "mongoose"; // Import Types for ObjectId type

export async function attendanceRecord(
  studentId: string,
  teacherId: string,
  classId: string,
  date: Date
) {
  try {
    // Validate class and teacher exist
    const classExists = await ClassModel.findById(classId);
    if (!classExists) throw new Error("Class not found");

    const teacherExists = await TeacherModel.findById(teacherId);
    if (!teacherExists) throw new Error("Teacher not found");

    // Fetch all students in the class
    const studentsInClass = await StudentModel.find({
      class: new Types.ObjectId(classId),
    });

    // Prepare updates for students' attendance status and create attendance records
    const attendanceOperations = studentsInClass.map(async (student) => {
      const isInitiatingStudent = student._id.toString() === studentId;
      const attendanceStatus = isInitiatingStudent ? "present" : "absent";

      // Update student's attendance status
      await StudentModel.updateOne(
        { _id: student._id },
        { $set: { attendanceStatus } }
      );

      // Create a new attendance record
      const newAttendanceRecord = new AttendanceModel({
        date: date,
        student: student._id,
        teacher: teacherId,
        class: classId,
      });

      return newAttendanceRecord.save();
    });

    // Execute all operations
    await Promise.all(attendanceOperations);

    // Optionally, return a meaningful response
    return {
      message: "Attendance updated and records created successfully",
      date: date.toISOString().split("T")[0],
      class: classId,
      teacher: teacherId,
      // Additional details can be included as needed
    };
  } catch (error) {
    console.error("Failed to update attendance and create records", error);
    throw error;
  }
}
