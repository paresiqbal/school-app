// libarry
import { Router, Request, Response } from "express";
import { AttendanceModel } from "../models/Attendance";

const router = Router();

// record attendance route
router.post("record-attendance", async (req: Request, res: Response) => {
  const { studentId, teacherId, status } = req.body;
  const date = new Date();

  try {
    const attendance = new AttendanceModel(
      {
        student: studentId,
        teacher: teacherId,
        date: date.toISOString().slice(0, 10),
      },
      { status: status },
      { new: true, upsert: true }
    );

    res.status(200).json(attendance);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while recording attendance." });
  }
});

export { router as AttendanceRouter };
