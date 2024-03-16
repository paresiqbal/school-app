// library
import { Router, Request, Response } from "express";

// models
import { TeacherModel } from "../models/Teacher";
import { AttendanceStatus, StudentModel } from "../models/Student";

const router = Router();

router.post("/check-attendance", async (req: Request, res: Response) => {
  const { teacherId, classId, date, studentIds } = req.body;

  try {
    // Find & check teacher
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Find & check all students in the class
    const students = await StudentModel.find({ class: classId });
    if (!students.length) {
      return res.status(404).json({ error: "No students found in this class" });
    }

    await StudentModel.updateOne(
      { _id: { $in: studentIds }, class: classId }, // Filter by student IDs and class
      { attendanceStatus: AttendanceStatus.Present }
    );

    // Generate attendance report format
    const attendanceReport = {
      "attendance-class": classId,
      date,
      teacher: teacher.fullname,
      "students-record": students.map((student) => ({
        id: student._id,
        fullname: student.fullname,
        class: classId,
        status: student.attendanceStatus || AttendanceStatus.Absent,
      })),
    };

    res.json(attendanceReport);
    res.json({ message: "Attendance status updated successfully" });
  } catch (error) {
    console.error("Error while checking attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as AttendanceRouter };
