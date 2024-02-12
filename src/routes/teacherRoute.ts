// libary
import { Router, Request, Response } from "express";

const router = Router();

// register account
router.post("/register", (req: Request, res: Response) => {});

// login account
router.post("/login", (req: Request, res: Response) => {});

export { router as TeacherRoute };
