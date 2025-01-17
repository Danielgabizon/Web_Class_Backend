import express, { Request, Response } from "express";
const router = express.Router();
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
 * /posts/{postId}/comments:
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
 *      - in: query
 *        name: userId
 *        schema:
 *           type: string
 *        required: true
 *        description: The user ID from the auth token
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
 */
router.post(
  "/posts/:postId/comments",
  authController.authTestMiddleware,
  (req: Request, res: Response) => {
    commentsController.addNewItem(req, res);
  }
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a specific post
 *     description: Retrieves all comments associated with a specific post.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *          type: string
 *          description: The Id of the post to get comments for
 *     responses:
 *       200:
 *         description: Successfully retrieved comments for the post
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
router.get("/posts/:postId/comments", (req: Request, res: Response) => {
  commentsController.getAllItems(req, res);
});

/**
 * @swagger
 * /posts/{postId}/comments/{id}:
 *   put:
 *     summary: Update a specific comment
 *     description: Updates a specific comment by its ID within a given post.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the post to which the comment belongs
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the comment to update
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: The user ID from the auth token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
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
 */
router.put(
  "/posts/:postId/comments/:id",
  authController.authTestMiddleware,
  (req: Request, res: Response) => {
    commentsController.updateItem(req, res);
  }
);

/**
 * @swagger
 * /posts/{postId}/comments/{id}:
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
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID to which the comment belongs
 *       - in: query
 *         name: userId
 *         schema:
 *            type: string
 *         required: true
 *         description: The user ID from the auth token
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
 */
router.delete(
  "/posts/:postId/comments/:id",
  authController.authTestMiddleware,
  (req: Request, res: Response) => {
    commentsController.deleteItem(req, res);
  }
);

export default router;
