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
      const item = req.body;
      item.sender = req.query._id;
      const newItem = await this.model.create(item);
      return res.status(200).send({ status: "Success", data: newItem });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }
  async  getAllCommentsByPost(req: Request, res: Response) : Promise<Response> {
      try {
        const filter = req.params;
        let comments;
        if (filter.postid) {
          // if the query string contains a post id, filter the Comments by that post
          comments = await Comments.find({ postid: filter.postid });
        }
        return res.status(200).send({ status: "Success", data: comments });
      } catch (err) {
        return res.status(500).send(`Error fetching Comments: ${err.message}`);
      }
    }
}

export default new commentsController(Comments);
