import { Router, Request, Response } from "express";
import { AttendanceModel } from "../models/Attendance";
import { ClassModel } from "../models/Class";
import { StudentModel } from "../models/Student";
import { TeacherModel } from "../models/Teacher";

const router = Router();

router.post("/recordAttendance", async (req: Request, res: Response) => {
  try {
    const { studentId, classId, teacherId } = req.body;

    // Validate that the class and teacher exist
    const existingClass = await ClassModel.findById(classId);
    const existingTeacher = await TeacherModel.findById(teacherId);

    if (!existingClass || !existingTeacher) {
      return res.status(404).send("Class or teacher not found.");
    }

    // Find all students in the class
    const students = await StudentModel.find({ class: classId });

    if (students.length === 0) {
      return res.status(404).send("No students found in the class.");
    }

    // Create attendance records
    const attendanceRecords = students.map((student) => ({
      date: new Date(), // Current date
      class: classId,
      teacher: teacherId,
      student: student._id,
      status: student._id.toString() === studentId ? "present" : "absent", // Mark the initiating student as present, others as absent
    }));

    // Save all attendance records to the database
    await AttendanceModel.insertMany(attendanceRecords);

    res.status(201).send("Attendance records created successfully.");
  } catch (error) {
    console.error("Failed to record attendance:", error);
    res.status(500).send("Internal server error.");
  }
});

export default router;
