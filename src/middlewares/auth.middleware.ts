import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { RequestHandler } from "express";
import { createErrorResponse } from "../types/api-response";

declare global {
  namespace Express {
    interface Request {
      user: Omit<IUser, "password"> & { _id: string };
    }
  }
}

export const protectRoute: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return createErrorResponse(res, "No token", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    if (!decoded) {
      return createErrorResponse(res, "Invalid token", 401);
    }
    const user = (await User.findById(decoded.userId).select(
      "-password"
    )) as IUser & { _id: string };
    if (!user) {
      return createErrorResponse(res, "User not found", 401);
    }
    req.user = user;
    next();
  } catch (error) {
    createErrorResponse(res, error, 401);
  }
};
