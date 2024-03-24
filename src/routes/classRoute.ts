// libarry
import { Router, Request, Response } from "express";

// model
import { ClassModel, MajorModel } from "../models/Class";
import { ClassErrors, MajorErrors } from "../enumError";
import { StudentModel } from "../models/Student";

const router = Router();

// create major
router.post("/addMajor", async (req: Request, res: Response) => {
  try {
    const { majorName } = req.body;
    const checkMajor = await MajorModel.findOne({ majorName });
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
router.post("/addClass", async (req: Request, res: Response) => {
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

    const existingClass = await ClassModel.findOne({ level, majorId });
    if (existingClass) {
      return res.status(400).json({ type: ClassErrors.CLASS_ALREADY_EXISTS });
    }

    // concatenate level and majorName to create classLabel
    const classLabel = `${level} - ${major.majorName} `;

    const newClass = await ClassModel.create({
      level,
      majorId,
      majorName: major.majorName,
      classLabel,
    });

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
    res.status(500).json({ error: error.message });
  }
});

// get all classes
router.get("/classes", async (req: Request, res: Response) => {
  try {
    const classes = await ClassModel.find({});
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

// delete major by ID
router.delete("/delete-major/:majorId", async (req: Request, res: Response) => {
  try {
    const { majorId } = req.params;

    const existMajor = await MajorModel.findById(majorId);
    if (!existMajor) {
      return res.status(404).json({ type: MajorErrors.MAJOR_NOT_FOUND });
    }
    await MajorModel.findByIdAndDelete(majorId);

    res.json({ message: "Major deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete class by ID
router.delete("/delete-class/:classId", async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const existClass = await ClassModel.findById(classId);
    if (!existClass) {
      return res.status(404).json({ type: ClassErrors.CLASS_NOT_FOUND });
    }
    await ClassModel.findByIdAndDelete(classId);

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as ClassRouter };
