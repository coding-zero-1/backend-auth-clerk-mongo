import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.token;
  if (!token) {
    return res.status(400).json({
      success: false,
      error: true,
      msg: "You are unauthorized to access this resource, Kindly signUp first",
    });
  }
  try {
    const decoded = jwt.decode(token as string) as { clerkId: string };
    req.clerkId = decoded?.clerkId;
    next();
  } catch (error) {
    if (error instanceof Error)
      console.error(`Error in auth middleware: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: true,
      msg: "Internal server error, please try again later",
    });
  }
}

export default authMiddleware;