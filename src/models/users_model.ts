import mongoose from "mongoose";

export interface IUser {
  username: string;
  password: string;
  email: string;
  fname: string;
  lname: string;
  refreshTokens?: string[];
}

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  refreshTokens: {
    type: [String],
    default: [],
  },
});

export default mongoose.model<IUser>("User", userSchema);
