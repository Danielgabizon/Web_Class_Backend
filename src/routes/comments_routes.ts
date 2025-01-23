import express, { Request, Response } from "express";
const router = express.Router({ mergeParams: true });
import commentsController from "../controllers/comments_controller";
import authController from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 5fc2d5b5b3473c44b32495ab
 *         postId:
 *           type: string
 *           example: 5fc2d5a8b3473c44b32495aa
 *         sender:
 *           type: string
 *           example: 5fc2d593b3473c44b32495a9
 *         content:
 *           type: string
 *           example: "This is the content of my comment"
 *     CommentInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the comment.
 *           example: "This is the content of my comment"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /comments/{postId}:
 *  post:
 *    summary: Add a new comment to a post
 *    description: Adds a new comment for the authenticated user on the specified post.
 *    tags: [Comments]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: string
 *        required: true
 *        description: The post ID to comment on
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/CommentInput'
 *    responses:
 *      201:
 *        description: Comment created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Success
 *                data:
 *                  $ref: '#/components/schemas/Comment'
 *      400:
 *        description: Bad request, validation error or incorrect input
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "Please provide a comment's content"
 *      403:
 *        description: Unauthorized to create comment
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: Unauthorized
 *      401:
 *        description: No token provided
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: Access denied
 */
router.post(
  "/:postId",
  authController.authTestMiddleware,
  (req: Request, res: Response) => {
    commentsController.addNewItem(req, res);
  }
);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieves all comments or filters comments by post.
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *          type: string
 *          description: The Id of the post to get comments for
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       400:
 *        description: Error retrieving comments
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "An error occurred"
 
 */
router.get("/", (req: Request, res: Response) => {
  commentsController.getAllItems(req, res);
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieves a single comment by its ID.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *          description: The comment ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: Comment not found
 *       400:
 *          description: Error retrieving comment
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    example: Error
 *                  message:
 *                    type: string
 *                    example: An error occurred
 */
router.get("/:id", (req: Request, res: Response) => {
  commentsController.getItemById(req, res);
});

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update a specific comment
 *     description: Updates a specific comment by its ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the comment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: Successfully updated the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request, validation error or incorrect input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: "Please provide a comment's content"
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: "Comment not found"
 *       403:
 *        description: Unauthorized to update this comment
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "Unauthorized to update this comment"
 *       401:
 *        description: No token provided
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: Access denied
 */
router.put(
  "/:id",
  authController.authTestMiddleware,
  (req: Request, res: Response) => {
    commentsController.updateItem(req, res);
  }
);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment by its ID.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Successfully deleted the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: string
 *                   example: ""
 *       404:
 *         description: Comment not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: "Comment not found"
 *       400:
 *        description: Error deleting comment
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "An error occurred"
 *       403:
 *        description: Unauthorized to delete this comment
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "Unauthorized to delete this comment"
 *       401:
 *        description: No token provided
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: Access denied
 */
router.delete(
  "/:id",
  authController.authTestMiddleware,
  (req: Request, res: Response) => {
    commentsController.deleteItem(req, res);
  }
);

export default router;
