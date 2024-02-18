// libary
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// models
import { IStudent, StudentModel } from "../models/Student";
import { ITeacher, TeacherModel } from "../models/Teacher";

// error handling
import { UserErrors } from "../enumError";

const router = Router();
dotenv.config();

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
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

// login account
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user = null;
    let role = "";

    const student = await StudentModel.findOne({ username });
    if (student) {
      user = student;
      role = "student";
    } else {
      const teacher = await TeacherModel.findOne({ username });
      if (teacher) {
        user = teacher;
        role = "teacher";
      }
    }

    // If no user was found
    if (!user) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIAL });
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);

    // Respond with token, userID, and role
    console.log({ user, role });
    res.json({ token, userID: user._id, role });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

export { router as UserRouter };
