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
      const postid = req.params.postId; // The ID of the post to comment on
      const senderId = req.query._id; // The ID of the user making the comment
      const content = req.body.content; // The content of the comment
      if (!content || content.trim() === "") {
        throw new Error("Please provide a comment's content");
      }
      const comment = { postid: postid, sender: senderId, content: content };
      const new_comment = await this.model.create(comment);
      return res.status(201).send({ status: "Success", data: new_comment });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }

  async getAllCommentsByPost(req: Request, res: Response): Promise<Response> {
    try {
      const comments = await Comments.find({ postid: req.params.postId });
      return res.status(200).send({ status: "Success", data: comments });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }

  async updateItem(req: Request, res: Response) {
    try {
      const commentId = req.params.id;
      const postid = req.params.postId; // The ID of the post to comment on
      const senderId = req.query._id; // The ID of the user making the comment
      const content = req.body.content; // The content of the comment
      if (!content || content.trim() === "") {
        throw new Error("Please provide a comment's content");
      }
      const updatedData = {
        postid: postid,
        sender: senderId,
        content: req.body.content,
      };

      // Update the item and return the updated document
      const updatedComment = await this.model.findByIdAndUpdate(
        commentId, // The ID of the item to update
        updatedData, // The content to update
        { new: true, runValidators: true } // Options: return the updated document and validate the update
      );
      if (!updatedComment) {
        return res
          .status(404)
          .send({ status: "Error", message: "comment not found" });
      }
      return res.status(200).send({ status: "Success", data: updatedComment });
    } catch (err) {
      return res.status(400).send({ status: "Error", message: err.message });
    }
  }
}

export default new commentsController(Comments);
