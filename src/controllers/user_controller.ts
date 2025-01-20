import { Request, Response } from "express";
import User from "../models/users_model";
import postController from "./posts_controller";
const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).send({ status: "Error", message: "User not found" });
      return;
    }
    res.status(200).send({ status: "Success", data: user });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    // Use postController logic for filtering by sender
    req.query.sender = userId; // Add sender filter dynamically
    await postController.getAllItems(req, res);
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    const { username } = req.body;
    if (!userId) throw new Error("User not found");

    if (!username || username.trim() === "")
      throw new Error("Please provide a username");

    // Check if the username is already taken by another user
    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser.id !== userId)
      throw new Error("Username already taken");

    // Update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: username },
      { new: true, runValidators: true } // Return updated document
    ).select("-password");
    res.status(200).send({ status: "Success", data: updatedUser });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    if (!userId) throw new Error("User not found");

    await User.findByIdAndDelete(userId);
    res.status(200).send({ status: "Success", message: "User deleted" });
  } catch (err) {
    res.status(400).send({ status: "Error", message: err.message });
  }
};

export default { getCurrentUser, updateCurrentUser, deleteUser, getUserPosts };
