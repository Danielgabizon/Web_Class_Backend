import Comments, { IComment } from "../models/comments_model";
import BaseController from "./base_controller";

class commentsController extends BaseController<IComment> {
  constructor() {
    super(Comments);
  }

  async  getAllCommentsByPost(req, res) : Promise<Response> {
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

export default commentsController;
