import { Router, Request, Response } from "express";
import { attendanceRecord } from "../services/attendanceRecord";

const router = Router();

// Endpoint to check and record attendance for a class based on a single student's check-in
router.post("/check-attendance", async (req: Request, res: Response) => {
  try {
    const { studentId, teacherId, classId, date } = req.body;
    const formattedOutput = await attendanceRecord(
      studentId,
      teacherId,
      classId,
      new Date(date)
    );
    res.status(201).json(formattedOutput);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as AttendanceRouter };
