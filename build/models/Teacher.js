"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherModel = void 0;
// library
const mongoose_1 = require("mongoose");
const TeacherSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    fullname: { type: String, required: true },
    nip: { type: String },
    role: { type: String, default: "teacher" },
});
exports.TeacherModel = (0, mongoose_1.model)("Teacher", TeacherSchema);
