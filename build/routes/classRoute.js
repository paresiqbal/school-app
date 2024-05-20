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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRouter = void 0;
// libarry
const express_1 = require("express");
// model
const Class_1 = require("../models/Class");
const enumError_1 = require("../enumError");
const Student_1 = require("../models/Student");
const router = (0, express_1.Router)();
exports.ClassRouter = router;
// create major
router.post("/addMajor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { majorName } = req.body;
        const checkMajor = yield Class_1.MajorModel.findOne({ majorName });
        if (checkMajor) {
            return res.status(400).json({ type: enumError_1.MajorErrors.MAJOR_ALREADY_EXISTS });
        }
        const major = yield Class_1.MajorModel.create(req.body);
        res.status(201).json(major);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// create class
router.post("/addClass", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { level, majorId } = req.body;
        // Check level validity
        if (!["X", "XI", "XII"].includes(level)) {
            return res.status(400).json({ type: enumError_1.ClassErrors.CLASS_VALIDITY });
        }
        // Check for major existence and retrieve its name
        const major = yield Class_1.MajorModel.findById(majorId);
        if (!major) {
            return res.status(400).json({ type: enumError_1.MajorErrors.MAJOR_NOT_FOUND });
        }
        const existingClass = yield Class_1.ClassModel.findOne({ level, majorId });
        if (existingClass) {
            return res.status(400).json({ type: enumError_1.ClassErrors.CLASS_ALREADY_EXISTS });
        }
        // concatenate level and majorName to create classLabel
        const classLabel = `${level} - ${major.majorName} `;
        const newClass = yield Class_1.ClassModel.create({
            level,
            majorId,
            majorName: major.majorName,
            classLabel,
        });
        res.status(201).json(newClass);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// get all majors
router.get("/majors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const majors = yield Class_1.MajorModel.find({});
        res.json(majors);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// get all classes
router.get("/classes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classes = yield Class_1.ClassModel.find({});
        res.json(classes);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// get student base on class
router.get("/specific-class/:classId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const classId = req.params.classId;
        const students = yield Student_1.StudentModel.find({ class: classId }).populate("class");
        res.json(students);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}));
// delete major by ID
router.delete("/delete-major/:majorId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { majorId } = req.params;
        const existMajor = yield Class_1.MajorModel.findById(majorId);
        if (!existMajor) {
            return res.status(404).json({ type: enumError_1.MajorErrors.MAJOR_NOT_FOUND });
        }
        yield Class_1.MajorModel.findByIdAndDelete(majorId);
        res.json({ message: "Major deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// delete class by ID
router.delete("/delete-class/:classId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId } = req.params;
        const existClass = yield Class_1.ClassModel.findById(classId);
        if (!existClass) {
            return res.status(404).json({ type: enumError_1.ClassErrors.CLASS_NOT_FOUND });
        }
        yield Class_1.ClassModel.findByIdAndDelete(classId);
        res.json({ message: "Class deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
