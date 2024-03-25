import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Models
import { IStudent, StudentModel } from "../models/Student";

// Error handling
import { UserErrors } from "../enumError";
import { ClassModel } from "../models/Class";

const router = Router();
dotenv.config();

// Register account
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, fullname, nis, yearEntry, classId } = req.body;

  try {
    // check if username already exists in the Student collection
    const findStudents = await StudentModel.findOne({ username });
    if (findStudents) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // Check if classId is valid
    const findClass = await ClassModel.findById(classId);
    if (!findClass) {
      return res.status(400).json({ type: UserErrors.CLASS_NOT_FOUND });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account
    const newStudent = new StudentModel({
      fullname,
      username,
      password: hashedPassword,
      nis,
      class: classId,
      yearEntry,
      role: "student",
    });
    await newStudent.save();

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

// Login account
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user: IStudent | null = null;
    user = await StudentModel.findOne({ username });

    if (!user) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    // Check if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIAL });
    }

    // Create and assign token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userID: user._id });
  } catch (error) {
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

// update student
router.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, fullname, nis, yearEntry, avatar } = req.body;

  try {
    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    // Check if username is to be updated and is unique
    if (username) {
      const findStudents = await StudentModel.findOne({
        username: new RegExp(`^${username}$`, "i"),
        _id: { $ne: id },
      });
      if (findStudents) {
        return res
          .status(400)
          .json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
      }
      student.username = username;
    }

    // Hash password if it's provided and not empty
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      student.password = hashedPassword;
    }

    // Update the student document with provided values or leave them as they are
    student.fullname = fullname || student.fullname;
    student.nis = nis || student.nis;
    student.yearEntry = yearEntry || student.yearEntry;
    student.avatar = avatar || student.avatar; // Update avatar if provided

    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

// delete student
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const student = await StudentModel.findById(id);
    if (!student) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    await StudentModel.findByIdAndDelete(id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

// get all students
router.get("/students", async (req, res) => {
  try {
    const students = await StudentModel.find({}).populate(
      "class",
      "level majorName"
    );
    res.json(students);
  } catch (error) {
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

// get student by id
router.get("/student/:id", async (req, res) => {
  const { id } = req.params;
  const { username, password, fullname, nis, yearEntry, role } = req.body;

  try {
    const student = await StudentModel.findById(id).populate(
      "class",
      "level majorName"
    );
    if (!student) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ type: UserErrors.SERVER_ERROR });
  }
});

export { router as StudentRouter };
