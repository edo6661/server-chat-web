import { RequestHandler } from "express";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../types/api-response";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt";

export const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return createErrorResponse(res, "Invalid credentials", 400);
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      return createErrorResponse(res, "Invalid credentials", 400);
    }
    generateToken(user._id.toString(), res);
    const userResponse = user.toObject();
    delete userResponse.password;
    createSuccessResponse(
      res,
      {
        user: {
          ...userResponse,
        },
      },
      "User logged in successfully"
    );
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};

export const register: RequestHandler = async (req, res) => {
  const { email, password, fullname, confirmPassword } = req.body;
  try {
    const emailExist = await User.findOne({
      email,
    });
    if (emailExist) {
      return createErrorResponse(res, "Email already exists", 400);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      fullname,
    });

    await user.save();
    generateToken(user._id.toString(), res);
    const userResponse = user.toObject();
    delete userResponse.password;
    createSuccessResponse(
      res,
      {
        user: {
          ...userResponse,
        },
      },
      "User registered successfully",
      201
    );
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};
export const logout: RequestHandler = (req, res) => {
  try {
    res.clearCookie("jwt");
    createSuccessResponse(res, {}, "User logged out successfully");
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};
