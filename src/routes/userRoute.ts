// libary
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// models
import { StudentModel } from "../models/Student";
import { TeacherModel } from "../models/Teacher";

// error handling
import { UserErrors } from "../enumError";

const router = Router();

// register account
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
    // check if username already exists
    const findStudents = await StudentModel.findOne({ username });
    const findTeachers = await TeacherModel.findOne({ username });
    if (findStudents || findTeachers) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
  } catch (error) {}
});

// login account
// router.post("/login", (req: Request, res: Response) => {});

export { router as UserRouter };
