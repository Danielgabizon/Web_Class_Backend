import Comments, { IComment } from "../models/comments_model";
import BaseController from "./base_controller";
import { Model } from "mongoose";
import { Request, Response } from "express";

class commentsController extends BaseController<IComment> {
  constructor(model: Model<IComment>) {
    super(model);
  }

  async addNewItem(req: Request, res: Response): Promise<Response> {
    try {
      const senderId = req.query.userId; // The ID of the user making the comment
      if (!senderId) throw new Error("User not found");
      const postId = req.params.postId; // The ID of the post to comment on
      if (!postId) throw new Error("Post not found");
      const content = req.body.content; // The content of the comment
      if (!content || content.trim() === "") {
        throw new Error("Please provide a comment's content");
      }

      const comment = { postId: postId, sender: senderId, content: content };
      const new_comment = await this.model.create(comment);

      return res.status(201).send({ status: "Success", data: new_comment });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }

  async getAllItems(req: Request, res: Response): Promise<Response> {
    try {
      const postId = req.params.postId; // The Id of the post to get comments for
      if (!postId) throw new Error("Post not found");

      const comments = await Comments.find({ postId: postId });

      return res.status(200).send({ status: "Success", data: comments });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const userId = req.query.userId; // The user ID from query from auth token
      if (!userId) {
        throw new Error("User not found");
      }

      const postId = req.params.postId; // The ID of the post to update the comment on
      if (!postId) throw new Error("Post not found");

      // retrieving the existing comment to check ownership

      const commentId = req.params.id; // The ID of the comment to update
      const existingComment = await this.model.findById(commentId);

      if (!existingComment) {
        return res
          .status(404)
          .send({ status: "Error", message: "Comment not found" });
      }

      // Check if the user is the owner of the post
      if (existingComment.sender.toString() !== userId) {
        return res.status(403).send({
          status: "Error",
          message: "Unauthorized to update this comment",
        });
      }

      const content = req.body.content; // The content of the comment
      if (!content || content.trim() === "") {
        throw new Error("Please provide a comment's content");
      }

      // Update the item and return the updated document
      const updatedComment = await this.model.findByIdAndUpdate(
        commentId, // The ID of the item to update
        { content: content }, // The content to update
        { new: true } // return the updated document
      );

      return res.status(200).send({ status: "Success", data: updatedComment });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
  async deleteItem(req: Request, res: Response) {
    try {
      const postId = req.params.postId; // The ID of the post to delete the comment on
      if (!postId) throw new Error("Post not found");

      const userId = req.query.userId; // The user ID from query from auth token
      if (!userId) {
        throw new Error("User not found");
      }

      // retrieving the existing comment to check ownership

      const commentId = req.params.id; // The ID of the comment to delete
      const existingComment = await this.model.findById(commentId);

      if (!existingComment) {
        return res
          .status(404)
          .send({ status: "Error", message: "Comment not found" });
      }

      // Check if the user is the owner of the post
      if (existingComment.sender.toString() !== userId) {
        return res.status(403).send({
          status: "Error",
          message: "Unauthorized to delete this comment",
        });
      }

      await this.model.findByIdAndDelete(commentId);
      return res.status(200).send({ status: "Success", data: "" });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}
export default new commentsController(Comments);
