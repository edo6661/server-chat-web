import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { RequestHandler } from "express";
import { createErrorResponse } from "../types/api-response";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<IUser, "password">;
    }
  }
}

export const protectRoute: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      createErrorResponse(res, "No token", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!decoded) {
      createErrorResponse(res, "Invalid token", 401);
    }
    const user = (await User.findById(decoded.userId).select(
      "-password"
    )) as IUser;
    if (!user) {
      createErrorResponse(res, "User not found", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    createErrorResponse(res, error, 401);
  }
};
