import express from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import {
  getMessages,
  getUserChats,
  sendMessage,
} from "../controllers/message.controller";

export const messageRoutes = express.Router();

messageRoutes.get("/users", protectRoute, getUserChats);
messageRoutes.get("/:id", protectRoute, getMessages);
messageRoutes.post("/send/:id", protectRoute, sendMessage);
