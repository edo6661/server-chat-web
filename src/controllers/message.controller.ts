import { RequestHandler } from "express";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../types/api-response";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
export const getUserChats: RequestHandler = async (req, res) => {
  const currentUserId = req.user._id;
  try {
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");
    if (!filteredUsers) {
      return createErrorResponse(res, "No users found", 400);
    }

    createSuccessResponse(
      res,
      {
        users: filteredUsers,
      },
      "Users fetched successfully"
    );
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};

export const getMessages: RequestHandler = async (req, res) => {
  const { id: receiverId } = req.params;
  const currentUserId = req.user._id;
  try {
    const messages = await Message.find({
      $or: [
        {
          senderId: currentUserId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: currentUserId,
        },
      ],
    });

    createSuccessResponse(
      res,
      {
        messages,
      },
      "Messages fetched successfully"
    );
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};

export const sendMessage: RequestHandler = async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;
  try {
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    createSuccessResponse(
      res,
      {
        message: newMessage,
      },
      "Message sent successfully"
    );
  } catch (error) {
    createErrorResponse(res, error, 400);
  }
};
