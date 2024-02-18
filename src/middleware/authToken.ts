// libaries
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    jwt.verify(authHeader, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.sendStatus(403);
      }

      // no error
      next();
    });
  }

  return res.status(401).json({ type: "Unauthorized" });
};
