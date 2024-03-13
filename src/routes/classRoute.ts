// library
import { Router, Request, Response } from "express";

// models
import { ClassModel, MajorModel } from "../models/Class";
import { ClassErrors, MajorErrors } from "../enumError";

const router = Router();

// create major
router.post("/addMajor", async (req: Request, res: Response) => {
  try {
    const checkMajor = await MajorModel.findOne({
      majorName: req.body.majorName,
    });
    if (checkMajor) {
      return res.status(400).json({ type: MajorErrors.MAJOR_ALREADY_EXISTS });
    }

    const major = await MajorModel.create(req.body);
    res.status(201).json(major);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// create class
router.post("/addClass", async (req, res) => {
  try {
    const { level, majorId } = req.body;

    // Check level validity
    if (!["X", "XI", "XII"].includes(level)) {
      return res.status(400).json({ type: ClassErrors.CLASS_VALIDITY });
    }

    // Check for major existence and retrieve its name
    const major = await MajorModel.findById(majorId);
    if (!major) {
      return res.status(400).json({ type: MajorErrors.MAJOR_NOT_FOUND });
    }

    // Check if a class with the same level and majorId already exists
    const existingClass = await ClassModel.findOne({ level, majorId });
    if (existingClass) {
      return res.status(400).json({ type: ClassErrors.CLASS_ALREADY_EXISTS });
    }

    // Create the class with both majorId and majorName
    const newClass = await ClassModel.create({
      level,
      majorId,
      majorName: major.majorName,
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get all majors
router.get("/majors", async (res: Response) => {
  try {
    const majors = await MajorModel.find({});
    res.json(majors);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// get all classes
router.get("/classes", async (res: Response) => {
  try {
    const classes = await ClassModel.find({});
    res.json(classes);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as ClassRouter };
