import "dotenv/config";
import express from "express";
import routes from "./routes/routes";
import { connectDB } from "./lib/mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server, io } from "./lib/socket";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);
  next();
});

console.log("CLIENT_URL", process.env.CLIENT_URL);
app.use("/api/v1", routes);
server.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
  connectDB();
});
