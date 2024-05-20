"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModel = void 0;
const mongoose_1 = require("mongoose");
const AttendanceSchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    class: { type: mongoose_1.Schema.Types.ObjectId, ref: "Class", required: true },
    teacher: { type: mongoose_1.Schema.Types.ObjectId, ref: "Teacher", required: true },
    subject: { type: String, required: true },
    timestamp: { type: Date, required: true },
    students: [
        {
            id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Student" },
            fullname: { type: String, required: true },
            class: { type: mongoose_1.Schema.Types.ObjectId, ref: "Class", required: true },
            isPresent: {
                type: String,
                enum: ["absent", "present", "excuse"],
                default: "absent",
            },
        },
    ],
});
exports.AttendanceModel = (0, mongoose_1.model)("Attendance", AttendanceSchema);
