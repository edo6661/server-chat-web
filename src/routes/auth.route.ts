import express from "express";
export const authRoutes = express.Router();

authRoutes.get("/register", (req, res) => {
  res.send("Register route");
});
authRoutes.get("login", (req, res) => {
  res.send("Login route");
});
