import express, { Request, Response } from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import authController from "../controllers/auth_controller";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// setting Up the routes:
/**
 * @swagger
 * /comments/{postid}:
 *   post:
 *     summary: Create a new comment for a post
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       201:
 *         description: Created
 */

router.post("/:postid",  authController.authTestMiddleware, (req: Request, res: Response) => {
  commentsController.addNewItem(req, res);
});
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Retrieve a list of comments
 *     responses:
 *       200:
 *         description: A list of comments
 */

router.get("/", (req: Request, res: Response) => {
  commentsController.getAllItems(req, res);
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Retrieve a single comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: A single comment
 */

router.get("/:id", (req: Request, res: Response) => {
  commentsController.getItemById(req, res);
});
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Updated
 */

router.put("/:id",  authController.authTestMiddleware, (req: Request, res: Response) => {
  commentsController.updateItem(req, res);
});
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       204:
 *         description: Deleted
 */

router.delete("/:id",  authController.authTestMiddleware, (req: Request, res: Response) => {
  commentsController.deleteItem(req, res);
});
/**
 * @swagger
 * /comments/post/{postid}:
 *   get:
 *     summary: Retrieve all comments for a post
 *     parameters:
 *       - in: path
 *         name: postid
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: A list of comments for a post
 */
router.get("/post/:postid", (req: Request, res: Response) => {
  commentsController.getAllCommentsByPost(req, res);
});

export default router;