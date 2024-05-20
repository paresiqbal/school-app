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
exports.AttendanceRouter = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
// models
const Attendance_1 = require("../models/Attendance");
const Student_1 = require("../models/Student");
const Class_1 = require("../models/Class");
const Teacher_1 = require("../models/Teacher");
const router = express_1.default.Router();
exports.AttendanceRouter = router;
router.post("/mark", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, teacherId, subject, studentId, classId } = req.body;
        // Check if an existing attendance record exists for the given classId, studentId, and date
        let existingAttendance = yield Attendance_1.AttendanceModel.findOne({
            date,
            class: classId,
        });
        if (existingAttendance) {
            // Check if the studentId is the same and the teacherId is different
            const studentIndex = existingAttendance.students.findIndex((s) => s.id.toString() === studentId);
            // Check if the teacherId is the same as the one in the request
            const isSameTeacher = existingAttendance.teacher.toString() === teacherId;
            if (studentIndex !== -1 && isSameTeacher) {
                // If the student is already present, return with a message
                if (existingAttendance.students[studentIndex].isPresent === "present") {
                    return res.status(400).json({
                        message: "Presensi sudah ada untuk siswa ini pada tanggal hari ini",
                    });
                }
                // Otherwise, update the existing record with the new student's presence
                existingAttendance.students[studentIndex].isPresent = "present";
                yield existingAttendance.save();
                return res.status(200).json({
                    message: "Kehadiran berhasil diperbarui",
                    attendance: existingAttendance,
                });
            }
            else if (!isSameTeacher) {
                return res.status(400).json({
                    message: "Anda tidak berwenang menandai kehadiran siswa ini",
                });
            }
        }
        // Find the teacher and verify if exists
        const teacher = yield Teacher_1.TeacherModel.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        // Find the class and verify if exists
        const classInfo = yield Class_1.ClassModel.findById(classId);
        if (!classInfo) {
            return res.status(404).json({ message: "Class not found" });
        }
        // Find the student and verify if exists
        const student = yield Student_1.StudentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Create attendance record
        const attendanceData = {
            date,
            class: classId,
            teacher: teacherId,
            subject,
            timestamp: new Date(),
            students: [],
        };
        // Get all students in the class
        const studentsInClass = yield Student_1.StudentModel.find({ class: classId });
        const studentsAttendance = studentsInClass.map((student) => ({
            id: new mongoose_1.Types.ObjectId(student._id.toString()),
            fullname: student.fullname,
            class: new mongoose_1.Types.ObjectId(classId.toString()),
            isPresent: student._id.toString() === studentId ? "present" : "absent",
        }));
        const presentStudentIndex = studentsAttendance.findIndex((student) => student.id === new mongoose_1.Types.ObjectId(studentId));
        if (presentStudentIndex !== -1) {
            studentsAttendance[presentStudentIndex].isPresent = "present";
        }
        attendanceData.students = studentsAttendance;
        // Save attendance record
        const attendance = new Attendance_1.AttendanceModel(attendanceData);
        yield attendance.save();
        res
            .status(201)
            .json({ message: "Kehadiran ditandai dengan sukses", attendance });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal menandai kehadiran", error });
    }
}));
// get attendance student
router.get("/attendance-record", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date, classId } = req.query;
        if (!date || !classId) {
            return res.status(400).json({ message: "tanggal dan kelas diperlukan" });
        }
        const attendanceRecords = yield Attendance_1.AttendanceModel.find({
            date,
            class: classId,
        });
        if (attendanceRecords.length === 0) {
            return res
                .status(404)
                .json({ message: "Tidak ada catatan kehadiran yang ditemukan" });
        }
        res.status(200).json({ attendanceRecords });
    }
    catch (error) {
        res.status(500).json({ message: "Gagal mendapatkan kehadiran", error });
    }
}));
// edit attendance record
router.patch("/edit-attendance-record", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { attendanceId, studentId, isPresent } = req.body;
        if (!attendanceId || !studentId || !isPresent) {
            return res.status(400).json({
                message: "attendanceId, studentId and isPresent are required",
            });
        }
        // find attendance record
        const attendance = yield Attendance_1.AttendanceModel.findById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        // find students inside record
        const studentIndex = attendance.students.findIndex((student) => student.id.toString() === studentId);
        if (studentIndex === -1) {
            return res
                .status(404)
                .json({ message: "Student not found in the attendance record" });
        }
        // change status
        attendance.students[studentIndex].isPresent = isPresent;
        yield attendance.save();
        res
            .status(200)
            .json({ message: "Attendance updated successfully", attendance });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update attendance", error });
    }
}));
// get attendance teacher
router.get("/attendance-teacher/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacherId } = req.query;
        if (!teacherId) {
            return res.status(400).json({ message: "teacher ID required" });
        }
        const attendanceRecords = yield Attendance_1.AttendanceModel.find({
            teacher: teacherId,
        });
        if (attendanceRecords.length === 0) {
            return res.status(404).json({ message: "No attendance records found" });
        }
        res.status(200).json({ attendanceRecords });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to get attendance", error });
    }
}));
