import { Router, Request, Response } from "express";
import { attendanceRecord } from "../services/attendanceRecord";

const router = Router();

// Endpoint to check and record attendance for a class based on a single student's check-in
router.post("/check-attendance", async (req: Request, res: Response) => {
  try {
    const { studentId, teacherId, classId, date } = req.body; // Ensure classId is also received from the client
    // Validate input
    if (!studentId || !teacherId || !classId || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const formattedOutput = await attendanceRecord(
      studentId,
      teacherId,
      classId,
      new Date(date)
    );
    res.status(201).json({ success: true, data: formattedOutput });
  } catch (error) {
    console.error(error); // Logging the error can help in debugging
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});

export { router as AttendanceRouter };
