"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Models
const Teacher_1 = require("../models/Teacher");
const Admin_1 = require("../models/Admin");
// Error handling
const enumError_1 = require("../enumError");
const router = (0, express_1.Router)();
exports.UserRouter = router;
dotenv_1.default.config();
// Register account
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role, fullname, nip } = req.body;
    try {
        // Check if username already exists in either the Admin or Teacher collections
        const findTeachers = yield Teacher_1.TeacherModel.findOne({ username });
        const findAdmins = yield Admin_1.AdminModel.findOne({ username });
        if (findTeachers || findAdmins) {
            return res.status(400).json({ type: enumError_1.UserErrors.USERNAME_ALREADY_EXISTS });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create account based on role
        if (role === "teacher") {
            const newTeacher = new Teacher_1.TeacherModel({
                username,
                password: hashedPassword,
                fullname,
                nip,
                role: "teacher",
            });
            yield newTeacher.save();
        }
        else if (role === "admin") {
            const newAdmin = new Admin_1.AdminModel({
                username,
                password: hashedPassword,
                fullname,
                role: "admin",
            });
            yield newAdmin.save();
        }
        else {
            // Handle invalid role
            return res.status(400).json({ type: enumError_1.UserErrors.INVALID_ROLE });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
// Login account
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        let user = null;
        let role = "";
        // Check if user exists and match the role
        const teacher = yield Teacher_1.TeacherModel.findOne({ username });
        if (teacher) {
            user = teacher;
            role = "teacher";
        }
        else {
            const admin = yield Admin_1.AdminModel.findOne({ username });
            if (admin) {
                user = admin;
                role = "admin";
            }
        }
        if (!user) {
            return res.status(400).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        // Check if password is valid
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ type: enumError_1.UserErrors.WRONG_CREDENTIAL });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user._id, role }, process.env.JWT_SECRET);
        res.json({
            token,
            userID: user._id,
            role,
            username: user.username,
            fullname: user.fullname,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
// Delete account
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const teacher = yield Teacher_1.TeacherModel.findByIdAndDelete(id);
        if (teacher) {
            return res.json(teacher);
        }
        const admin = yield Admin_1.AdminModel.findByIdAndDelete(id);
        if (admin) {
            return res.json(admin);
        }
        res.status(404).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
router.get("/all-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch admins
        const admins = yield Admin_1.AdminModel.find().lean();
        const teachers = yield Teacher_1.TeacherModel.find().lean();
        // Combine admin & teacher
        const users = admins.concat(teachers);
        res.json(users);
    }
    catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).send("Error fetching users");
    }
}));
// get all teacher
router.get("/teachers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield Teacher_1.TeacherModel.find({});
        res.json(teachers);
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
// get all admin
router.get("/admins", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield Admin_1.AdminModel.find({});
        res.json(admins);
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
// get teacher by id
router.get("/teacher/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const teacher = yield Teacher_1.TeacherModel.findById(id);
        if (!teacher) {
            return res.status(404).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        res.json(teacher);
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
// update teacher data
router.patch("/update-teacher/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, password, fullname, nip } = req.body;
    try {
        const teacher = yield Teacher_1.TeacherModel.findById(id);
        if (!teacher) {
            return res.status(404).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        const findTeachers = yield Teacher_1.TeacherModel.findOne({
            username: new RegExp(`^${username}$`, "i"),
            _id: { $ne: id },
        });
        const findAdmins = yield Admin_1.AdminModel.findOne({
            username: new RegExp(`^${username}$`, "i"),
        });
        if (findTeachers || findAdmins) {
            return res.status(409).json({ type: enumError_1.UserErrors.USERNAME_ALREADY_EXISTS });
        }
        // Hash password only if it's been provided
        if (password) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            teacher.password = hashedPassword;
        }
        teacher.username = username || teacher.username;
        teacher.fullname = fullname || teacher.fullname;
        teacher.nip = nip || teacher.nip;
        yield teacher.save();
        res.json(teacher);
    }
    catch (error) {
        res
            .status(500)
            .json({ type: enumError_1.UserErrors.SERVER_ERROR, error: error.message });
    }
}));
