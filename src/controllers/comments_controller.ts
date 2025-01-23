import Comments, { IComment } from "../models/comments_model";
import BaseController from "./base_controller";
import { Model } from "mongoose";
import { Request, Response } from "express";
import Posts from "../models/posts_model";

class commentsController extends BaseController<IComment> {
  constructor(model: Model<IComment>) {
    super(model);
  }

  async addNewItem(req: Request, res: Response): Promise<Response> {
    try {
      const senderId = req.query.userId; // The ID of the user making the comment

      const postId = req.params.postId; // The ID of the post to comment on
      // check if the post exists
      const post = await Posts.findById(postId);
      if (!post) {
        return res
          .status(404)
          .send({ status: "Error", message: "Post not found" });
      }

      const content = req.body.content; // The content of the comment
      if (!content || content.trim() === "") {
        throw new Error("Please provide a comment's content");
      }

      req.body = { ...req.body, postId: postId, sender: senderId }; // Add the post ID and sender ID to the comment
      return await super.addNewItem(req, res);
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }

  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const filter: Record<string, any> = req.query.postId
        ? { postId: req.query.postId }
        : {};

      if (Object.keys(filter).length > 0) {
        // If a filter is applied
        const comments = await Comments.find(filter);
        return res.status(200).send({ status: "Success", data: comments });
      }

      return await super.getAllItems(req, res); // Call the base implementation if no filter is applied
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const userId = req.query.userId; // The user ID from query from auth token

      // retrieving the existing comment to check ownership

      const commentId = req.params.id; // The ID of the comment to update
      const existingComment = await this.model.findById(commentId);

      if (!existingComment) {
        return res
          .status(404)
          .send({ status: "Error", message: "Comment not found" });
      }

      // Check if the user is the owner of the comment
      if (existingComment.sender.toString() !== userId) {
        return res.status(403).send({
          status: "Error",
          message: "Unauthorized",
        });
      }

      const content = req.body.content; // The content of the comment

      if (!content || content.trim() === "") {
        throw new Error("Please provide a comment's content");
      }

      return await super.updateItem(req, res);
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async deleteItem(req: Request, res: Response) {
    try {
      const userId = req.query.userId; // The user ID from query from auth token

      // retrieving the existing comment to check ownership

      const commentId = req.params.id; // The ID of the comment to delete
      const existingComment = await this.model.findById(commentId);

      if (!existingComment) {
        return res
          .status(404)
          .send({ status: "Error", message: "Comment not found" });
      }

      // Check if the user is the owner of the comment
      if (existingComment.sender.toString() !== userId) {
        return res.status(403).send({
          status: "Error",
          message: "Unauthorized",
        });
      }

      return await super.deleteItem(req, res);
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}
export default new commentsController(Comments);
