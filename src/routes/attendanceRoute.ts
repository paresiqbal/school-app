// libarry
import { Router, Request, Response } from "express";
import { StudentModel } from "../models/Student";

const router = Router();

// get student base on class
router.get("/specific-class/:classId", async (req: Request, res: Response) => {
  try {
    const classId = req.params.classId;
    const students = await StudentModel.find({ class: classId }).populate(
      "class"
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export { router as AttendanceRouter };
