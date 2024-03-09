import { Router, Request, Response } from "express";

import { ClassErrors } from "../enumError";
import { ClassModel } from "../models/Class";

const router = Router();

// Create class
router.post("/create", async (req: Request, res: Response) => {
  const { level, major } = req.body; // Now expecting level as "X", "XI", or "XII"

  try {
    // Validate level and major
    if (
      ["X", "XI", "XII"].includes(level) &&
      ["TKJ", "TBSM", "TKR", "TITL"].includes(major)
    ) {
      // Check for existing class with the same level and major
      const existingClass = await ClassModel.findOne({ level, major });
      if (existingClass) {
        return res
          .status(400)
          .json({ error: ClassErrors.CLASS_ALREADY_EXISTS });
      }

      // Construct full class name
      const name = `${level} ${major}`; // Name based on level and major

      // Create class
      const newClass = new ClassModel({ name, level, major });
      await newClass.save();

      res.json({ message: "Class created successfully." });
    } else {
      res.status(400).json({ error: ClassErrors.INVALID_LEVEL_OR_MAJOR }); // Handle invalid input more specifically
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: ClassErrors.SERVER_ERROR });
  }
});

export { router as ClassRouter };
