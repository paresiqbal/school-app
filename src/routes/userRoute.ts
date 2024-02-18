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
    let role = null;
    // search user in collection
    const student: IStudent = await StudentModel.findOne({ username });
    const teacher: ITeacher = await TeacherModel.findOne({ username });
    if (student) {
      role = "student";
    } else if (teacher) {
      role = "teacher";
    }
    if (!role) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    // check password
    const user = student || teacher; // Since we already determined the role, we can directly use the found user
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIAL });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role }, // Include role in the token payload if needed for subsequent requests
      process.env.JWT_SECRET
    );
    res.json({ token, userID: user._id, role }); // Include role in response
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

export { router as UserRouter };
