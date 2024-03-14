import { AttendanceModel } from "../models/Attendance";
import { ClassModel } from "../models/Class";
import { StudentModel } from "../models/Student";
import { TeacherModel } from "../models/Teacher";

// Updated function to create attendance records for all students in the same class
export async function attendanceRecord(
  studentId: string,
  teacherId: string,
  date: Date
) {
  try {
    const initiatingStudent = await StudentModel.findById(studentId);
    if (!initiatingStudent) {
      throw new Error("Student not found");
    }

    const classInfo = await ClassModel.findById(initiatingStudent.class);
    if (!classInfo) {
      throw new Error("Class not found");
    }

    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) {
      throw new Error("Teacher not found");
    }

    const studentsInClass = await StudentModel.find({
      class: initiatingStudent.class,
    });

    const studentsRecord = studentsInClass.map((studentInClass) => {
      // Mark the initiating student differently, others as absent
      const status =
        studentInClass._id.toString() === studentId ? "present" : "absent";

      return {
        id: studentInClass._id.toString(),
        fullname: studentInClass.fullname,
        class: classInfo.level + "-" + classInfo.majorName,
        status: status,
      };
    });

    // Optionally, here you can also save the attendance records to the database
    // before returning the response.

    return {
      "attendance-class": classInfo.level + "-" + classInfo.majorName,
      date: date.toISOString().split("T")[0],
      teacher: teacher.fullname,
      "students-record": studentsRecord,
    };
  } catch (error) {
    console.error("Failed to create and format attendance records", error);
    throw error;
  }
}
