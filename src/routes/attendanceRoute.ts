import { Router } from "express";
import { attendanceRecord } from "../services/attendanceRecord";

const router = Router();

router.post("/check-attendance", async (req, res) => {
  const { teacherId, classId, date } = req.body; // Removed studentId from the destructuring

  try {
    // Updated function call to match the new signature of attendanceRecord
    const result = await attendanceRecord(teacherId, classId, date);
    res.status(201).json(result); // Updated status code to 201 Created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as AttendanceRouter };
