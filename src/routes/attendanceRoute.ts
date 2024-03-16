import { Router } from "express";

const router = Router();

router.post("/check-attendance", async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export { router as AttendanceRouter };
