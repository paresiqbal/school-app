import { AttendanceModel } from "../models/Attendance";
import { ClassModel } from "../models/Class";
import { StudentModel } from "../models/Student";
import { TeacherModel } from "../models/Teacher";

// Updated function to create attendance records for all students in the same class
export async function attendanceRecord(studentId, teacherId, date) {
  try {
    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    const classInfo = await ClassModel.findById(student.class);
    if (!classInfo) {
      throw new Error("Class not found");
    }

    // Find the teacher by the provided ID
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    // Assuming the teacher model has a name field
    const teacherName = teacher.fullname;

    const studentsInClass = await StudentModel.find({ class: student.class });

    const studentsRecord = studentsInClass.map((studentInClass) => ({
      id: studentInClass._id.toString(),
      fullname: studentInClass.fullname,
      class: classInfo.level + "-" + classInfo.majorName,
      status: "present", // Adjust this as needed
    }));

    return {
      "attendance-class": classInfo.level + "-" + classInfo.majorName,
      date: date.toISOString().split("T")[0],
      teacher: teacherName,
      "students-record": studentsRecord,
    };
  } catch (error) {
    console.error("Failed to create and format attendance records", error);
    throw error;
  }
}
