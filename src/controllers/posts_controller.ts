import Posts, { IPost } from "../models/posts_model";
import BaseController from "./base_controller";

const postController = new BaseController<IPost>(Posts);

export default postController;
