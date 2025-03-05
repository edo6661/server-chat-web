import express from "express";
import { getUsers, self, updateProfile } from "../controllers/user.controller";
import { protectRoute } from "../middlewares/auth.middleware";
export const userRoutes = express.Router();

userRoutes.get("/", getUsers);
userRoutes.get("/self", protectRoute, self);
userRoutes.put("/profile", protectRoute, updateProfile);
