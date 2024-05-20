"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModel = void 0;
// library
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    fullname: { type: String, required: true },
    role: { type: String, default: "admin" },
});
exports.AdminModel = (0, mongoose_1.model)("Admin", AdminSchema);
