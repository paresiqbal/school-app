import { Router, Request, Response } from "express";
import { TeacherModel } from "../models/Teacher";
import { AttendanceStatus, StudentModel } from "../models/Student";

const router = Router();

router.post("/check-attendance", async (req: Request, res: Response) => {
  const { teacherId, studentId, classId, date } = req.body;

  try {
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const attendanceReport = {
      "attendance-class": classId,
      date,
      teacher: teacher.fullname,
      "students-record": [
        {
          id: student._id,
          fullname: student.fullname,
          class: classId,
          status: student.attendanceStatus || AttendanceStatus.Absent,
        },
      ],
    };

    res.json(attendanceReport);
  } catch (error) {
    console.error("Error while checking attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as AttendanceRouter };
