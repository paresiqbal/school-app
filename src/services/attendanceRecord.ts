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
    const classInfo = await ClassModel.findById(classId);
    if (!classInfo) throw new Error("Class not found");

    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) throw new Error("Teacher not found");

    const studentsInClass = await StudentModel.find({ class: classId });

    // Assuming status updates and record creations happen here

    // Map students to the desired output format
    const studentsRecord = studentsInClass.map((student) => ({
      id: student._id.toString(),
      fullname: student.fullname,
      class: `${classInfo.level}-${classInfo.majorName}`, // Or however you format this
      status: student._id.toString() === studentId ? "present" : "absent", // Simplified logic
    }));

    // Construct the response object
    const response = {
      "attendance-class": `${classInfo.level}-${classInfo.majorName}`,
      date: date.toISOString().split("T")[0],
      teacher: teacher.fullname,
      "students-record": studentsRecord,
    };

    return response;
  } catch (error) {
    console.error("Failed to update attendance and create records", error);
    throw error;
  }
}
