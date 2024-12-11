import mongoose from "mongoose";

export interface IUser {
  username: string;
  password: string;
  email: string;
  fname: string;
  lname: string;
}

const Schema = mongoose.Schema;

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
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
});

export default mongoose.model<IUser>("User", userSchema);
