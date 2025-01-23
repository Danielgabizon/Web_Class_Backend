import express, { Request, Response } from "express";
import authController from "../controllers/auth_controller";
import userController from "../controllers/user_controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Api for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *           properties:
 *             _id:
 *               type: string
 *               example: 64d2f34c9b3d5e001ee0fede
 *             username:
 *               type: string
 *               example: johndoe
 *             email:
 *               type: string
 *               example: johndoe@example.com
 *             fname:
 *               type: string
 *               example: John
 *             lname:
 *               type: string
 *               example: Doe
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a user's details
 *     description: Fetches details of a user by their user ID.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Success
 *                data:
 *                  $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "User not found"
 *       400:
 *         description: Bad request
 *         content:
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
router.get("/:id", userController.getUserDetails);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user's details
 *     description: Updates details of a user by user ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: The unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  example: Error
 *                message:
 *                  type: string
 *                  example: "User not found"
 *       400:
 *         description: Bad request
 *         content:
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
  userController.updateUserDetails
);

export default router;
