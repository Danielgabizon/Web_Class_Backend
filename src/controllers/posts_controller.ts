import { Request, Response } from "express";
import Posts, { IPost } from "../models/posts_model";
import BaseController from "./base_controller";
import { Model } from "mongoose";
import Comments from "../models/comments_model";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
class PostsController extends BaseController<IPost> {
  constructor(model: Model<IPost>) {
    super(model);
  }
  async addNewItem(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.query.userId; // The user Id

      const { title, content } = req.body;

      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }

      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }

      req.body = { ...req.body, sender: userId }; // add the sender to the request body
      return await super.addNewItem(req, res); // call the base implementation
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }
  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const current_page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      const skip = (current_page - 1) * limit;

      // apply a filter if we are searching by sender (userId)
      const filter = req.query.sender ? { sender: req.query.sender } : {};

      const posts = await this.model
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalPosts = await this.model.countDocuments(filter);

      // Send the response with posts and pagination info
      return res.status(200).send({
        status: "Success",
        data: posts,
        pagination: {
          totalPages: Math.ceil(totalPosts / limit), // Total pages
          currentPage: current_page, // Current page
          totalPosts, // Total number of posts
        },
      });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const postId = req.params.id; // The post's ID
      const userId = req.query.userId; // The user ID from query from auth token

      // retrieving the existing post to check ownership
      const existingPost = await this.model.findById(postId);

      if (!existingPost) {
        return res
          .status(404)
          .send({ status: "Error", message: "Post not found" });
      }

      // Check if the user is the owner of the post
      if (existingPost.sender.toString() !== userId) {
        return res.status(403).send({
          status: "Error",
          message: "Unauthorized",
        });
      }

      const { title, content } = req.body;

      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }

      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }

      return await super.updateItem(req, res); // Call the base implementation
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async deleteItem(req: Request, res: Response) {
    try {
      const postId = req.params.id; // The post's ID
      const userId = req.query.userId; // The user ID from query from auth token

      // retrieving the existing post to check ownership
      const existingPost = await this.model.findById(postId);

      if (!existingPost) {
        return res
          .status(404)
          .send({ status: "Error", message: "Post not found" });
      }

      // Check if the user is the owner of the post
      if (existingPost.sender.toString() !== userId) {
        return res.status(403).send({
          status: "Error",
          message: "Unauthorized",
        });
      }
      // delete all comments associated with the post
      await Comments.deleteMany({ postId: postId });
      // call the base implementation
      return await super.deleteItem(req, res);
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async toggleLike(req: Request, res: Response) {
    try {
      const postId = req.params.id; // The post's ID
      const userId = req.query.userId as string; // The user ID from query from auth token

      const existingPost = await this.model.findById(postId);

      if (!existingPost) {
        return res
          .status(404)
          .send({ status: "Error", message: "Post not found" });
      }
      const likes = existingPost.likes.map((like) => like.toString());

      const isLiked = likes.includes(userId);

      if (isLiked) {
        // remove the like
        existingPost.likes = existingPost.likes.filter(
          (like) => like.toString() !== userId
        );
      } else {
        // add the like
        existingPost.likes.push(new mongoose.Types.ObjectId(userId));
      }
      existingPost.save();
      return res.status(200).send({
        status: "Success",
        data: existingPost,
      });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}

const postController = new PostsController(Posts);

export default postController;
