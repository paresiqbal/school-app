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

    // create account
    if (role === "student") {
      const newStudent = new StudentModel({
        username,
        password: hashedPassword,
      });
      await newStudent.save();
    } else if (role === "teacher") {
      const newTeacher = new TeacherModel({
        username,
        password: hashedPassword,
      });
      await newTeacher.save();
    } else {
      // handle invalid role
      return res.status(400).json({ type: UserErrors.INVALID_ROLE });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error while creating account." });
  }
});

// login account
// router.post("/login", (req: Request, res: Response) => {});

export { router as UserRouter };
