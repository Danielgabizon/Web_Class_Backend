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
      const { title, content } = req.body;
      if (!title || title.trim() === "") {
        throw new Error("Please provide a post's title");
      }
      if (!content || content.trim() === "") {
        throw new Error("Please provide a post's content");
      }
      const senderId = req.query._id;
      const post = { sender: senderId, title, content };
      const newPost = await this.model.create(post);
      return res.status(201).send({ status: "Success", data: newPost });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }
  async updateItem(req: Request, res: Response) {
    try {
      const itemId = req.params.id; // The ID of the item to update
      const updateContent = req.body; // The content to update

      // set the sender to the user's ID
      const senderId = req.query._id;
      updateContent.sender = senderId;

      // Update the item and return the updated document
      const updatedItem = await this.model.findByIdAndUpdate(
        itemId, // The ID of the item to update
        updateContent, // The content to update
        { new: true, runValidators: true } // Options: return the updated document and validate the update
      );
      if (!updatedItem) {
        return res
          .status(404)
          .send({ status: "Error", message: "item not found" });
      }
      return res.status(200).send({ status: "Success", data: updatedItem });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}

const postController = new PostsController(Posts);

export default postController;
