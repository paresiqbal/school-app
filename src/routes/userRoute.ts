import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Models
import { ITeacher, TeacherModel } from "../models/Teacher";
import { IAdmin, AdminModel } from "../models/Admin";

// Error handling
import { UserErrors } from "../enumError";

const router = Router();
dotenv.config();

// Register account
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, role, fullName } = req.body;

  try {
    // Check if username already exists in either the Admin or Teacher collections
    const findTeachers = await TeacherModel.findOne({ username });
    const findAdmins = await AdminModel.findOne({ username });
    if (findTeachers || findAdmins) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create account based on role
    if (role === "teacher") {
      const newTeacher = new TeacherModel({
        username,
        password: hashedPassword,
        fullName,
        role: "teacher",
      });
      await newTeacher.save();
    } else if (role === "admin") {
      const newAdmin = new AdminModel({
        username,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
    } else {
      // Handle invalid role
      return res.status(400).json({ type: UserErrors.INVALID_ROLE });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ type: UserErrors.SERVER_ERROR, error: error.message });
  }
});

// Login account
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let user: ITeacher | IAdmin | null = null;
    let role = "";

    // Check if user exists and match the role
    const teacher = await TeacherModel.findOne({ username });
    if (teacher) {
      user = teacher;
      role = "teacher";
    } else {
      const admin = await AdminModel.findOne({ username });
      if (admin) {
        user = admin;
        role = "admin";
      }
    }

    if (!user) {
      return res.status(400).json({ type: UserErrors.USER_NOT_FOUND });
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ type: UserErrors.WRONG_CREDENTIAL });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET);
    res.json({ token, userID: user._id, role });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ type: UserErrors.SERVER_ERROR, error: error.message });
  }
});

// get all teacher
router.get("/teachers", async (req, res) => {
  try {
    const teachers = await TeacherModel.find({});
    res.json(teachers);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ type: UserErrors.SERVER_ERROR, error: error.message });
  }
});

// Export the router
export { router as UserRouter };
