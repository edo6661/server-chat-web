import express from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { validateRequest } from "../utils/validate-request";
import { loginSchema, registerSchema } from "../validation/auth-validation";
export const authRoutes = express.Router();

authRoutes.post("/register", validateRequest(registerSchema), register);
authRoutes.post("/login", validateRequest(loginSchema), login);
authRoutes.post("/logout", logout);
