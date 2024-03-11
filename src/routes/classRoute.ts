import { Router, Request, Response } from "express";

import { ClassModel, MajorModel } from "../models/Class";

const router = Router();

// create major
router.post("/addMajor", async (req: Request, res: Response) => {
  try {
    const major = await MajorModel.create(req.body);
    res.status(201).json(major);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// create class
router.post("/addClass", async (req: Request, res: Response) => {
  try {
    const { level, majorId } = req.body;

    // cek kelas
    if (!["X", "XI", "XII"].includes(level)) {
      return res
        .status(400)
        .json({ error: "Invalid level. Must be X, XI, or XII." });
    }

    // cek jurusan
    const major = await MajorModel.findById(majorId);
    if (!major) {
      return res.status(400).json({ error: "Major not found." });
    }

    const newClass = await ClassModel.create({ level, major: majorId });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get all majors
router.get("/majors", async (req: Request, res: Response) => {
  try {
    const majors = await MajorModel.find({});
    res.json(majors);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as ClassRouter };
