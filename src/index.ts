// libarry
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// routes
import { UserRouter } from "./routes/userRoute";
import { StudentRouter } from "./routes/studentRoute";
import { ClassRouter } from "./routes/classRoute";
import { AttendanceRouter } from "./routes/attendanceRoute";

// config
dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// main page
app.get("/", (req, res) => {
  res.send("Welcome to the School App API!");
});

// routes
app.use("/api/user", UserRouter);
app.use("/api/student", StudentRouter);
app.use("/api/class", ClassRouter);
app.use("/api/attendance", AttendanceRouter);

// connect to mongodb
mongoose.connect(
  `mongodb+srv://pares:${process.env.MONGO_KEY}@school-app.hxivwoe.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=school-app`
);

// run server
app.listen(3001, () => {
  console.log("Server has started on port 3001 ⚡");
});
