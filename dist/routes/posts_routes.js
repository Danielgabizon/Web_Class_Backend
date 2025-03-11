"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const posts_controller_1 = __importDefault(require("../controllers/posts_controller"));
const auth_controller_1 = __importDefault(require("../controllers/auth_controller"));
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64d2f34c9b3d5e001ee0fedf
 *         title:
 *           type: string
 *           example: My First Post
 *         content:
 *           type: string
 *           example: This is the content of my first post.
 *         sender:
 *           type: string
 *           example: 64d2f34c9b3d5e001ee0fede
 *     PostInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           example: My First Post
 *         content:
 *           type: string
 *           example: This is the content of my first post.
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post for the authenticated user.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
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
 *                   example: "Validation error"
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
 *       403:
 *        description: Unauthorized to create post
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
 *
 *
 */
router.post("/", auth_controller_1.default.authTestMiddleware, (req, res) => {
    posts_controller_1.default.addNewItem(req, res);
});
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieves all posts or filters posts by sender or title.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: sender
 *         schema:
 *          type: string
 *          description: Filter posts by sender ID
 *       - in: query
 *         name: title
 *         schema:
 *          type: string
 *          description: Filter posts by title
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
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
 *                     $ref: '#/components/schemas/Post'
 *       400:
 *         description: Error retrieving posts
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
 *                   example: An error occurred
 */
router.get("/", (req, res) => {
    posts_controller_1.default.getAllItems(req, res);
});
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Retrieves a single post by its ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *          description: The post ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
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
 *                   example: Post not found
 *       400:
 *          description: Error retrieving post
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
router.get("/:id", (req, res) => {
    posts_controller_1.default.getItemById(req, res);
});
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     description: Updates a post's content and title.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          type: string
 *          description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Successfully updated the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
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
 *                   example: Post not found
 *       400:
 *        description: Error updating post
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
 *                  example: An error occurred
 *       403:
 *        description: Unauthorized to update post
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
router.put("/:id", auth_controller_1.default.authTestMiddleware, (req, res) => {
    posts_controller_1.default.updateItem(req, res);
});
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes a post by its ID.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Successfully deleted the post
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
 *         description: Post not found
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
 *                   example: Post not found
 *       400:
 *        description: Error deleting post
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
 *                  example: An error occurred
 *       403:
 *        description: Unauthorized to delete post
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
router.delete("/:id", auth_controller_1.default.authTestMiddleware, (req, res) => {
    posts_controller_1.default.deleteItem(req, res);
});
exports.default = router;
//# sourceMappingURL=posts_routes.js.map