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
  const { username, password, role, fullname, nip } = req.body;

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
        fullname,
        nip,
        role: "teacher",
      });
      await newTeacher.save();
    } else if (role === "admin") {
      const newAdmin = new AdminModel({
        username,
        password: hashedPassword,
        fullname,
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
router.get("/teachers", async (req: Request, res: Response) => {
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

// get all admin
router.get("/admins", async (req: Request, res: Response) => {
  try {
    const admins = await AdminModel.find({});
    res.json(admins);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ type: UserErrors.SERVER_ERROR, error: error.message });
  }
});

// get teacher by id
router.get("/teacher/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      return res.status(404).json({ type: UserErrors.USER_NOT_FOUND });
    }

    res.json(teacher);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ type: UserErrors.SERVER_ERROR, error: error.message });
  }
});

// update teacher data
router.patch("/teacher/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, password, fullname, nip } = req.body;

  try {
    const teacher = await TeacherModel.findById(id);
    if (!teacher) {
      return res.status(404).json({ type: UserErrors.USER_NOT_FOUND });
    }

    const findTeachers = await TeacherModel.findOne({
      username: new RegExp(`^${username}$`, "i"),
      _id: { $ne: id },
    });
    const findAdmins = await AdminModel.findOne({
      username: new RegExp(`^${username}$`, "i"),
    });
    if (findTeachers || findAdmins) {
      return res.status(409).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }

    // Hash password only if it's been provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      teacher.password = hashedPassword;
    }

    teacher.username = username || teacher.username;
    teacher.fullname = fullname || teacher.fullname;
    teacher.nip = nip || teacher.nip;

    await teacher.save();

    res.json(teacher);
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ type: UserErrors.SERVER_ERROR, error: error.message });
  }
});

// Export the router
export { router as UserRouter };
