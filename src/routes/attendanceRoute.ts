import express, { Request, Response } from "express";
import { Types } from "mongoose";

// models
import { AttendanceModel, IAttendance } from "../models/Attendance";
import { StudentModel, IStudent } from "../models/Student";
import { ClassModel } from "../models/Class";
import { TeacherModel } from "../models/Teacher";

const router = express.Router();

router.post("/mark", async (req: Request, res: Response) => {
  try {
    const { date, teacherId, subject, studentId, classId } = req.body;

    // Check if an existing attendance record exists for the given classId, studentId, and date
    let existingAttendance = await AttendanceModel.findOne({
      date,
      class: classId,
    });

    if (existingAttendance) {
      // Check if the studentId is the same and the teacherId is different
      const studentIndex = existingAttendance.students.findIndex(
        (s: any) => s.id.toString() === studentId
      );

      // Check if the teacherId is the same as the one in the request
      const isSameTeacher = existingAttendance.teacher.toString() === teacherId;

      if (studentIndex !== -1 && isSameTeacher) {
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
      } else if (!isSameTeacher) {
        return res.status(400).json({
          message: "You are not authorized to mark attendance for this student",
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
      subject,
      timestamp: new Date(),
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

// get attendance
router.get("/attendance-record", async (req: Request, res: Response) => {
  try {
    const { date, classId } = req.query;
    if (!date || !classId) {
      return res.status(400).json({ message: "date and classId are required" });
    }

    const attendanceRecords = await AttendanceModel.find({
      date,
      class: classId,
    });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({ attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Failed to get attendance", error });
  }
});

router.get("/attendance-record-by-teacher", async (req, res) => {
  try {
    const startDate = req.query.startDate as string;
    const teacherName = req.query.teacherName as string;

    if (!startDate || !teacherName) {
      return res
        .status(400)
        .json({ message: "startDate and teacherName are required" });
    }

    // Convert startDate to a Date object and calculate endDate to be one week later
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    // First, find the teacher's ID based on the provided name
    // This step assumes teacher names are unique
    const teacher = await TeacherModel.findOne({ name: teacherName });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Then, find attendance records within the date range for this teacher
    const attendanceRecords = await AttendanceModel.find({
      teacher: teacher._id,
      date: {
        $gte: start,
        $lt: end,
      },
    }).populate({
      path: "class",
      select: "level majorName -_id", // Adjust according to your class schema to include only level and majorName
    });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({
        message:
          "No attendance records found for the given teacher and date range",
      });
    }

    // Format the output
    const records = attendanceRecords.map((record) => ({
      teacherName: teacherName, // since we already have the teacher's name
      class: record.class, // assuming the populate method worked as expected
      date: record.date,
    }));

    res.status(200).json({ records });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get attendance records", error });
  }
});

// edit attendance record
router.patch("/edit-attendance-record", async (req: Request, res: Response) => {
  try {
    const { attendanceId, studentId, isPresent } = req.body;
    if (!attendanceId || !studentId || !isPresent) {
      return res.status(400).json({
        message: "attendanceId, studentId and isPresent are required",
      });
    }

    // find attendance record
    const attendance = await AttendanceModel.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // find students inside record
    const studentIndex = attendance.students.findIndex(
      (student) => student.id.toString() === studentId
    );
    if (studentIndex === -1) {
      return res
        .status(404)
        .json({ message: "Student not found in the attendance record" });
    }

    // change status
    attendance.students[studentIndex].isPresent = isPresent;
    await attendance.save();

    res
      .status(200)
      .json({ message: "Attendance updated successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Failed to update attendance", error });
  }
});

export { router as AttendanceRouter };
