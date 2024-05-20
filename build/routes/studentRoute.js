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
exports.StudentRouter = void 0;
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Models
const Student_1 = require("../models/Student");
// Error handling
const enumError_1 = require("../enumError");
const Class_1 = require("../models/Class");
const router = (0, express_1.Router)();
exports.StudentRouter = router;
dotenv_1.default.config();
// Register account
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, fullname, nis, yearEntry, classId } = req.body;
    try {
        // check if username already exists in the Student collection
        const findStudents = yield Student_1.StudentModel.findOne({ username });
        if (findStudents) {
            return res.status(400).json({ type: enumError_1.UserErrors.USERNAME_ALREADY_EXISTS });
        }
        // Check if classId is valid
        const findClass = yield Class_1.ClassModel.findById(classId);
        if (!findClass) {
            return res.status(400).json({ type: enumError_1.UserErrors.CLASS_NOT_FOUND });
        }
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create account
        const newStudent = new Student_1.StudentModel({
            fullname,
            username,
            password: hashedPassword,
            nis,
            class: classId,
            yearEntry,
            role: "student",
        });
        yield newStudent.save();
        res.status(201).json(newStudent);
    }
    catch (error) {
        res.status(500).json({ type: enumError_1.UserErrors.SERVER_ERROR });
    }
}));
// Login account
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        let user = null;
        user = yield Student_1.StudentModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        // Check if password is valid
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ type: enumError_1.UserErrors.WRONG_CREDENTIAL });
        }
        // Create and assign token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token, userID: user._id });
    }
    catch (error) {
        res.status(500).json({ type: enumError_1.UserErrors.SERVER_ERROR });
    }
}));
// update student
router.patch("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, password, fullname, nis, yearEntry, avatar } = req.body;
    try {
        const student = yield Student_1.StudentModel.findById(id);
        if (!student) {
            return res.status(400).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        // Check if username is to be updated and is unique
        if (username) {
            const findStudents = yield Student_1.StudentModel.findOne({
                username: new RegExp(`^${username}$`, "i"),
                _id: { $ne: id },
            });
            if (findStudents) {
                return res
                    .status(400)
                    .json({ type: enumError_1.UserErrors.USERNAME_ALREADY_EXISTS });
            }
            student.username = username;
        }
        // Hash password if it's provided and not empty
        if (password && password.trim() !== "") {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            student.password = hashedPassword;
        }
        // Update the student document with provided values or leave them as they are
        student.fullname = fullname || student.fullname;
        student.nis = nis || student.nis;
        student.yearEntry = yearEntry || student.yearEntry;
        student.avatar = avatar || student.avatar; // Update avatar if provided
        yield student.save();
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ type: enumError_1.UserErrors.SERVER_ERROR });
    }
}));
// delete student
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const student = yield Student_1.StudentModel.findById(id);
        if (!student) {
            return res.status(400).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        yield Student_1.StudentModel.findByIdAndDelete(id);
        res.json({ message: "Student deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ type: enumError_1.UserErrors.SERVER_ERROR });
    }
}));
// get all students
router.get("/students", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield Student_1.StudentModel.find({}).populate("class", "level majorName");
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ type: enumError_1.UserErrors.SERVER_ERROR });
    }
}));
// get student by id
router.get("/student/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, password, fullname, nis, yearEntry, role } = req.body;
    try {
        const student = yield Student_1.StudentModel.findById(id).populate("class", "level majorName");
        if (!student) {
            return res.status(400).json({ type: enumError_1.UserErrors.USER_NOT_FOUND });
        }
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ type: enumError_1.UserErrors.SERVER_ERROR });
    }
}));
