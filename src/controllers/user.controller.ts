import { RequestHandler } from "express";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../types/api-response";
import User from "../models/user.model";
import cloudinary from "../lib/cloudinary";
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    createSuccessResponse(res, { users }, "Users fetched successfully");
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  if (!profilePic) {
    createErrorResponse(res, "Profile picture is required", 400);
  }
  try {
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRes.secure_url,
      },
      {
        new: true,
      }
    );
    createSuccessResponse(
      res,
      { user: updatedUser },
      "User updated successfully"
    );
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};

export const self: RequestHandler = async (req, res) => {
  try {
    createSuccessResponse(res, { user: req.user }, "User fetched successfully");
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};
