// libarry
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// config
dotenv.config();

const app = express();
const key = process.env.MONGO_KEY;

// middleware
app.use(express.json());
app.use(cors());

// connect to mongodb
mongoose.connect(
  `mongodb+srv://pares:${key}@school-app.qc59lma.mongodb.net/school-app?retryWrites=true&w=majority`
);

// run server
app.listen(3001, () => {
  console.log("Server has started on port 3001");
});
