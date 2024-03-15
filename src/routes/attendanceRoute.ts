import { Router } from "express";
import { attendanceRecord } from "../services/attendanceRecord";

const router = Router();

router.post("/check-attendance", async (req, res) => {
  const { studentId, teacherId, classId, date } = req.body;

  try {
    const result = await attendanceRecord(studentId, teacherId, classId, date);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as AttendanceRouter };
