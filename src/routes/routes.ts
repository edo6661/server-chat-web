import express from "express";
import { authRoutes } from "./auth.route";
import { userRoutes } from "./user.route";
const routes = express.Router();
routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);

export default routes;
