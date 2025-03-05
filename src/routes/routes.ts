import express from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
import { messageRoutes } from "./message.route";
const routes = express.Router();
routes.use("/auth", authRoutes);
routes.use("/messages", messageRoutes);
routes.use("/users", userRoutes);

export default routes;
