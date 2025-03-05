import mongoose from "mongoose";
import { DEFAULT_PROFILE_PIC } from "../constants/user.constant";
export interface IUser extends Document {
  email: string;
  fullname: string;
  password?: string;
  profilePic: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    profilePic: {
      type: String,
      default: DEFAULT_PROFILE_PIC,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
