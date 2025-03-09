import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
export const getReceiverSocketIdBasedOnUserId = (userId: string) => {
  return userOnlineSocketMap[userId];
};
const userOnlineSocketMap: { [key: string]: string } = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // ! dapetin user id dari query yang udah dikirim dari frontend
  const userId = socket.handshake.query.userId as string;
  if (!userId) return;
  // ! simpen user id dan socket id ke dalam object userOnlineSocketMap
  userOnlineSocketMap[userId] = socket.id;
  // ! kirim online users ke semua connected clients
  io.emit("getOnlineUsers", Object.keys(userOnlineSocketMap));

  socket.on("disconnect", () => {
    // ! kalo user disconnect, hapus user id dari object userOnlineSocketMap
    delete userOnlineSocketMap[userId];
    // ! kirim online users setelah dihaupus user id yang disconnect
    io.emit("getOnlineUsers", Object.keys(userOnlineSocketMap));

    console.log("a user disconnected", socket.id);
  });
});
export { app, io, server };
