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
      const post = req.body;
      post.sender = req.query._id;
      const newPost = await this.model.create(post);
      return res.status(200).send({ status: "Success", data: newPost });
    } catch (error) {
      return res.status(400).send({ status: "Error", message: error.message });
    }
  }
}

const postController = new PostsController(Posts);

export default postController;
