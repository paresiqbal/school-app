import { NextFunction, Request, Response } from "express";
import { AttendanceStatus, StudentModel } from "../models/Student";

async function createAttendanceClassRecord(
  req: Request,
  res: Response
): Promise<Response> {
  // Change return type to Promise<Response>
  const { studentId, className } = req.body; // Remove unused variable teacherName

  try {
    const today = new Date().toISOString().slice(0, 10); // Get today's date (YYYY-MM-DD)

    const student = await StudentModel.findById(studentId); // Find the student by ID

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingRecord = await StudentModel.findOne({
      // Change Student to StudentModel
      class: className,
      "attendance.hasOwnProperty(today)": true,
    }); // Check if record for class and date exists

    if (existingRecord) {
      // Update existing record if student ID matches
      if (existingRecord._id.toString() === studentId) {
        student.attendance[today] = AttendanceStatus.Present; // Mark student present
      } else {
        return res
          .status(400)
          .json({ message: "Attendance record already exists for this class" });
      }
    } else {
      // Create new record
      const newRecord = student.attendance;
      newRecord[today] = AttendanceStatus.Present; // Mark student present (initial student)
      student.attendance = newRecord;

      // Optionally, loop through all students in the class and set their initial status to absent
      // This can be done if you have a reference to all class students in your logic
    }

    await student.save(); // Save changes to the student document

    return res
      .status(201)
      .json({ message: "Attendance record created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default createAttendanceClassRecord;
