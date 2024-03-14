// libarry
import { Router, Request, Response } from "express";
import { StudentModel } from "../models/Student";
import { attendanceRecord } from "../services/attendanceRecord";

const router = Router();

// get student base on class
router.post("/check-attendance", async (req, res) => {
  try {
    const { studentId, teacherId, date } = req.body;
    const formattedOutput = await attendanceRecord(
      studentId,
      teacherId,
      new Date(date)
    );
    res.status(201).json(formattedOutput);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export { router as AttendanceRouter };
