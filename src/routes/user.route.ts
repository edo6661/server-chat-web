import express from "express";
import { getUsers, updateUser } from "../controllers/user.controller";
import { protectRoute } from "../middlewares/auth.middleware";
export const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.put("/", protectRoute, updateUser);
