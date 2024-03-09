import { Router, Request, Response } from "express";

import { ClassModel } from "../models/Class";

const router = Router();

// POST route to create a new class
router.post("/classes", async (req: Request, res: Response) => {
  try {
    const newClass = await ClassModel.create(req.body);
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET route to fetch all classes
router.get("/classes", async (req, res: Response) => {
  try {
    const classes = await ClassModel.find().populate("major");
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as ClassRouter };
