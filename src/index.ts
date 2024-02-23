// libarry
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// routes
import { UserRouter } from "./routes/userRoute";
import { StudentRouter } from "./routes/studentRoute";

// config
dotenv.config();

const app = express();
const key = process.env.MONGO_KEY;

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/user", UserRouter);
app.use("/student", StudentRouter);

// connect to mongodb
mongoose.connect(
  `mongodb+srv://pares:${key}@school-app.qc59lma.mongodb.net/school-app`
);

// run server
app.listen(3001, () => {
  console.log("Server has started on port 3001");
});
