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
const PORT = process.env.PORT || 3001;

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
mongoose
  .connect(
    `mongodb+srv://pares:${process.env.MONGO_KEY}@school-app.hxivwoe.mongodb.net/schoolDB?retryWrites=true&w=majority&appName=school-app`
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// run server

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT} ⚡`);
});
