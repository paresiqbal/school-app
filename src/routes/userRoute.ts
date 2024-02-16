// libary
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// models
import Student from "../models/Student";
import Teacher from "../models/Teacher";

const router = Router();

// register account
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
    const findStudents = await Student.findOne;
  } catch (error) {}
});

// login account
// router.post("/login", (req: Request, res: Response) => {});

export { router as UserRouter };
