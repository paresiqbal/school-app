import { StudentModel } from "../models/Student";
import { ClassModel } from "../models/Class";
import { TeacherModel } from "../models/Teacher";
import { AttendanceModel } from "../models/Attendance";
import { Types } from "mongoose"; // Import Types for ObjectId

export async function createAndUpdateAttendanceRecords(
  studentId: string,
  teacherId: string,
  classId: string,
  date: Date
) {
  try {
    // Validate class and teacher exist
    const classExists = await ClassModel.findById(classId);
    if (!classExists) throw new Error("Class not found");

    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) throw new Error("Teacher not found");

    // Fetch all students in the class
    const studentsInClass = await StudentModel.find({
      class: new Types.ObjectId(classId),
    });

    // Initialize the array to hold the formatted student records for response
    let studentsRecord = [];

    for (const student of studentsInClass) {
      const isInitiatingStudent = student._id.toString() === studentId;
      const status = isInitiatingStudent ? "present" : "absent";

      // Create a new attendance record for each student
      await new AttendanceModel({
        date: date,
        student: student._id,
        teacher: teacherId,
        class: classId,
        status: status, // Assuming your Attendance model now includes a status field
      }).save();

      // Push the formatted student record for the response
      studentsRecord.push({
        id: student._id.toString(),
        fullname: student.fullname,
        class: classExists.level + "-" + classExists.majorName,
        status: status,
      });
    }

    // Format the overall response
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
