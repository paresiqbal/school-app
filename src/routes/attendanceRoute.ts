import express, { Request, Response } from "express";
import { Types } from "mongoose";
import { AttendanceModel, IAttendance } from "../models/Attendance";
import { StudentModel, IStudent } from "../models/Student";
import { ClassModel } from "../models/Class";
import { TeacherModel } from "../models/Teacher";

const router = express.Router();

router.post("/mark", async (req: Request, res: Response) => {
  try {
    const { date, teacherId, studentId, classId } = req.body;

    // Check if an existing attendance record exists for the given classId, studentId, and date
    let existingAttendance = await AttendanceModel.findOne({
      date,
      class: classId,
    });

    // If an existing record is found
    if (existingAttendance) {
      // Check if the studentId is different
      const studentIndex = existingAttendance.students.findIndex(
        (s: any) => s.id.toString() === studentId
      );
      if (studentIndex !== -1) {
        // If the student is already present, return with a message
        if (existingAttendance.students[studentIndex].isPresent === "present") {
          return res.status(400).json({
            message:
              "Attendance record already exists for this student on the given date",
          });
        }
        // Otherwise, update the existing record with the new student's presence
        existingAttendance.students[studentIndex].isPresent = "present";
        await existingAttendance.save();
        return res.status(200).json({
          message: "Attendance updated successfully",
          attendance: existingAttendance,
        });
      }
    }

    // Find the teacher and verify if exists
    const teacher = await TeacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the class and verify if exists
    const classInfo = await ClassModel.findById(classId);
    if (!classInfo) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find the student and verify if exists
    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Create attendance record
    const attendanceData: IAttendance = {
      date,
      class: classId,
      teacher: teacherId,
      timestamp: new Date(), // Use new Date() to get the current date and time
      students: [],
    };

    // Get all students in the class
    const studentsInClass = await StudentModel.find({ class: classId });

    const studentsAttendance = studentsInClass.map((student: IStudent) => ({
      id: new Types.ObjectId(student._id.toString()),
      fullname: student.fullname,
      class: new Types.ObjectId(classId.toString()),
      isPresent: student._id.toString() === studentId ? "present" : "absent",
    }));

    const presentStudentIndex = studentsAttendance.findIndex(
      (student) => student.id === new Types.ObjectId(studentId)
    );
    if (presentStudentIndex !== -1) {
      studentsAttendance[presentStudentIndex].isPresent = "present";
    }

    attendanceData.students = studentsAttendance;

    // Save attendance record
    const attendance = new AttendanceModel(attendanceData);
    await attendance.save();

    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark attendance", error });
  }
});

export { router as AttendanceRouter };
