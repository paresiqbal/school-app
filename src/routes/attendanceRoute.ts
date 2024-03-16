import { Router } from "express";
import createAttendanceClassRecord from "../services/attendanceRecord";

const router = Router();

router.post("/api/attendance", async (req, res) => {
  try {
    await createAttendanceClassRecord(req, res);
    // The response is handled inside the createAttendanceClassRecord function
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as AttendanceRouter };
