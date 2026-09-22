import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY || null;
if (!secret) {
  console.log("JWT Secret not found");
  process.exit(1);
}
interface customUserPayload extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({
        message: "Please provide auth token",
      });
    const result = jwt.verify(token, secret) as customUserPayload;
    req.id = result.id;
    next();
  } catch (error) {
    res.status(403).json({
      message: "You are unauthorised",
    });
  }
};
