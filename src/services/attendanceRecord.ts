import { AttendanceModel } from "../models/Attendance";
import { ClassModel } from "../models/Class";
import { StudentModel } from "../models/Student";

// Updated function to create attendance records for all students in the same class
export async function attendanceRecord(studentId, date) {
  try {
    // Find the student to get their class ID
    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Optionally, fetch the class to get its name and teacher
    const classInfo = await ClassModel.findById(student.class);
    if (!classInfo) {
      throw new Error("Class not found");
    }

    // Assuming classInfo contains teacher info or you can resolve it here
    const teacherName = "John Doe"; // This should be dynamically fetched based on your data model

    // Find all students in the same class
    const studentsInClass = await StudentModel.find({ class: student.class });

    // Create an attendance record for each student in the class (mocked here, adjust according to your logic)
    // Note: This step assumes you're creating attendance records in the database. Here we're focusing on the output format.

    const studentsRecord = studentsInClass.map((studentInClass) => ({
      id: studentInClass._id.toString(),
      fullname: studentInClass.fullname,
      class: classInfo.level + "-" + classInfo.majorName, // Adjust according to your class naming convention
      status: "present", // This should be determined based on your application's logic
    }));

    return {
      "attendance-class": classInfo.level + "-" + classInfo.majorName,
      date: date.toISOString().split("T")[0], // Format the date as YYYY-MM-DD
      teacher: teacherName,
      "students-record": studentsRecord,
    };
  } catch (error) {
    console.error("Failed to create and format attendance records", error);
    throw error; // Or handle the error appropriately
  }
}
