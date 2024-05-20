"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassModel = exports.MajorModel = void 0;
// library
const mongoose_1 = require("mongoose");
const MajorSchema = new mongoose_1.Schema({
    majorName: { type: String, required: true },
});
exports.MajorModel = (0, mongoose_1.model)("Major", MajorSchema);
const ClassSchema = new mongoose_1.Schema({
    level: { type: String, required: true, enum: ["X", "XI", "XII"] },
    majorId: { type: String, required: true },
    majorName: { type: String, required: true },
});
exports.ClassModel = (0, mongoose_1.model)("Class", ClassSchema);
