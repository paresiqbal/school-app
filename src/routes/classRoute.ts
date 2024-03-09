import { Router, Request, Response } from "express";

// models
import { ClassModel } from "../models/Class";

// Error handling
import { ClassErrors } from "../enumError";

const router = Router();

// Create class
router.post("/create", async (req: Request, res: Response) => {
  const { name, classCode } = req.body;

  try {
    const findClass = await ClassModel.findOne({ name });
    if (findClass) {
      return res.status(400).json({ type: ClassErrors.CLASS_ALREADY_EXISTS });
    }

    // Create class
    const newClass = new ClassModel({
      name,
      classCode,
    });
    await newClass.save();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ type: ClassErrors.SERVER_ERROR });
  }
});

export { router as ClassRouter };
