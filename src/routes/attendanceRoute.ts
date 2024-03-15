import { Router } from "express";
import { attendanceRecord } from "../services/attendanceRecord";

const router = Router();

router.post("/check-attendance", async (req, res) => {
  const { teacherId, classId, date, studentId } = req.body; // Include studentId in the destructuring

  try {
    // Pass studentId to the function
    const result = await attendanceRecord(teacherId, classId, date, studentId);
    res.status(201).json(result); // Consider using 201 for creation
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as AttendanceRouter };
