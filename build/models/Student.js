"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentModel = void 0;
// library
const mongoose_1 = require("mongoose");
const StudentSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nis: { type: Number, required: true, unique: true },
    yearEntry: { type: Number, required: true },
    avatar: { type: String },
    role: { type: String, default: "student" },
    class: { type: mongoose_1.Schema.Types.ObjectId, ref: "Class" },
});
exports.StudentModel = (0, mongoose_1.model)("Student", StudentSchema);
