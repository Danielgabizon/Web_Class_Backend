import Comments, { IComment } from "../models/comments_model";
import BaseController from "./base_controller";

const commentController = new BaseController<IComment>(Comments);

export default commentController;
