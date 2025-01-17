import { Request, Response } from "express";
import Posts, { IPost } from "../models/posts_model";
import BaseController from "./base_controller";
import { Model } from "mongoose";

class PostsController extends BaseController<IPost> {
  constructor(model: Model<IPost>) {
    super(model);
  }
  async addNewItem(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.query.userId; // The user Id
      if (!userId) throw new Error("User not found");

      const { title, content } = req.body;

      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }

      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }

      const post = { sender: userId, title: title, content: content };
      const newPost = await this.model.create(post);

      return res.status(201).send({ status: "Success", data: newPost });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }
  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const filter = req.query.sender ? { sender: req.query.sender } : {};

      const posts = await this.model.find(filter);
      return res.status(200).send({ status: "Success", data: posts });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async updateItem(req: Request, res: Response) {
    try {
      const postId = req.params.id; // The post's ID
      const userId = req.query.userId; // The user ID from query from auth token

      if (!userId) {
        throw new Error("User not found");
      }

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
          message: "Unauthorized to update this post",
        });
      }

      const { title, content } = req.body;

      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }

      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }

      const updatedData = { title: title, content: content };

      // updating the item and return the updated document
      const updatedPost = await this.model.findByIdAndUpdate(
        postId,
        updatedData,
        { new: true }
      );

      return res.status(200).send({ status: "Success", data: updatedPost });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async deleteItem(req: Request, res: Response) {
    try {
      const postId = req.params.id; // The post's ID
      const userId = req.query.userId; // The user ID from query from auth token

      if (!userId) {
        throw new Error("User not found");
      }

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
          message: "Unauthorized to delete this post",
        });
      }

      // deleting the item and return the deleted document
      const deletedPost = await this.model.findByIdAndDelete(postId);

      return res.status(200).send({ status: "Success", data: deletedPost });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}
const postController = new PostsController(Posts);

export default postController;
