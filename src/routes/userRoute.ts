// libary
import { Router, Request, Response } from "express";

const router = Router();

// register account
router.post("/register", (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  try {
  } catch (error) {}
});

// login account
// router.post("/login", (req: Request, res: Response) => {});

export { router as UserRouter };
