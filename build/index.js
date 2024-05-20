"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// libarry
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// routes
const userRoute_1 = require("./routes/userRoute");
const studentRoute_1 = require("./routes/studentRoute");
const classRoute_1 = require("./routes/classRoute");
const attendanceRoute_1 = require("./routes/attendanceRoute");
// config
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// main page
app.get("/", (req, res) => {
    res.send("Welcome to the School App API!");
});
// routes
app.use("/user", userRoute_1.UserRouter);
app.use("/student", studentRoute_1.StudentRouter);
app.use("/class", classRoute_1.ClassRouter);
app.use("/attendance", attendanceRoute_1.AttendanceRouter);
// connect to mongodb
mongoose_1.default.connect(`mongodb+srv://pares:${process.env.MONGO_KEY}@school-app.qc59lma.mongodb.net/school-app?retryWrites=true&w=majority`);
// run server
app.listen(3001, () => {
    console.log("Server has started on port 3001 🚀");
});
