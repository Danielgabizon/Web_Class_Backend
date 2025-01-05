import express, { Request, Response } from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";

const commentController = new commentsController();
// setting Up the routes:
router.post("/:postid", (req: Request, res: Response) => {
  commentController.addNewItem(req, res);
});
router.get("/", (req: Request, res: Response) => {
  commentController.getAllItems(req, res);
});
router.get("/:id", (req: Request, res: Response) => {
  commentController.getItemById(req, res);
});
router.put("/:id", (req: Request, res: Response) => {
  commentController.updateItem(req, res);
});
router.delete("/:id", (req: Request, res: Response) => {
  commentController.deleteItem(req, res);
});
router.get("/post/:postid", (req: Request, res: Response) => {
  commentController.getAllCommentsByPost(req, res);
});

export default router;
