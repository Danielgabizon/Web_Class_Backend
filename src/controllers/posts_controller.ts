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
      const senderId = req.query._id; // The post's sender Id
      const { title, content } = req.body;
      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }
      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }
      const post = { sender: senderId, title: title, content: content };
      const newPost = await this.model.create(post);
      return res.status(201).send({ status: "Success", data: newPost });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }
  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const allowedFilters = ["sender", "title"];
      const filter: Record<string, any> = {};
      for (const key of allowedFilters) {
        if (req.query[key]) {
          filter[key] = req.query[key];
        }
      }
      const items = await this.model.find(filter);
      return res.status(200).send({ status: "Success", data: items });
    } catch (err: any) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async updateItem(req: Request, res: Response) {
    try {
      const senderId = req.query._id; // The post's sender Id
      const postId = req.params.id; // The ID of the post to update
      const { title, content } = req.body;
      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }
      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }

      const updatedData = { sender: senderId, title: title, content: content };

      // Update the item and return the updated document
      const updatedPost = await this.model.findByIdAndUpdate(
        postId, // The ID of the item to update
        updatedData, // The content to update
        { new: true, runValidators: true } // Options: return the updated document and validate the update
      );
      if (!updatedPost) {
        return res
          .status(404)
          .send({ status: "Error", message: "item not found" });
      }
      return res.status(200).send({ status: "Success", data: updatedPost });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}

const postController = new PostsController(Posts);

export default postController;
