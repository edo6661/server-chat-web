import { RequestHandler } from "express";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../types/api-response";
import User from "../models/user.model";
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await User.find();
    createSuccessResponse(res, { users }, "Users fetched successfully");
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};
