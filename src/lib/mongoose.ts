import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!, {
      appName: "chat-app",
      dbName: "chat_db",
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(error);
    throw new Error("Error connecting to database");
  }
};
