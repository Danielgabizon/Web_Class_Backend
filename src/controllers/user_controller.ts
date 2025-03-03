import { Request, Response } from "express";
import User from "../models/users_model";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filter = req.query.username ? { username: req.query.username } : {};
    const users = await User.find(filter).select("-password -refreshTokens");
    res.status(200).json({
      status: "Success",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: "An error occurred",
    });
  }
};

const getUserDetailsById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -refreshTokens");
    if (!user) {
      res.status(404).send({ status: "Error", message: "User not found" });
      return;
    }
    res.status(200).send({ status: "Success", data: user });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user_info = req.body;
    const requiredFields = ["username", "email", "fname", "lname"];
    for (const field of requiredFields) {
      if (!user_info[field] || user_info[field] === "") {
        throw new Error("All fields are required");
      }
    }
    // Vaildate username format - 8 characters, letters and numbers only
    const usernameRegex = /^[A-Za-z0-9]{8,}$/;
    if (!usernameRegex.test(user_info.username)) {
      throw new Error(
        "Username must be at least 8 characters long and include only letters and numbers"
      );
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_info.email)) {
      throw new Error("Invalid email");
    }

    // check if user already exists
    const existingUser = await User.findOne({ username: user_info.username });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error("Username already exists");
    }

    // check if email already exists
    const existingEmail = await User.findOne({ email: user_info.email });
    if (existingEmail && existingEmail._id.toString() !== userId) {
      throw new Error("Email already exists");
    }
    // Update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true } // Return updated document
    ).select("-password -refreshToken");
    res.status(200).send({ status: "Success", data: updatedUser });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

export default {
  getUserDetailsById,
  getAllUsers,
  updateUserDetails,
};
