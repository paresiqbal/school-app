// libary
import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// register account
router.post("/register", (req: Request, res: Response) => {
  const { username, password, role } = req.body;
});

// login account
// router.post("/login", (req: Request, res: Response) => {});

export { router as UserRouter };
