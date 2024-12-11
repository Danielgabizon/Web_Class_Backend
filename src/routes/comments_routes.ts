import express, { Request, Response } from "express";
const router = express.Router();
import commentController from "../controllers/comments_controller";

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

export default router;
