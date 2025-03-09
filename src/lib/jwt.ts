import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export const generateToken = async (userId: string, res: Response) => {
  const token = jwt.sign(
    {
      userId: userId,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
      subject: userId,
    }
  );
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return token;
};
