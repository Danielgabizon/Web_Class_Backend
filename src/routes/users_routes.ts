import express, { Request, Response } from "express";
import authController from "../controllers/auth_controller";
import userController from "../controllers/user_controller";

const router = express.Router();

// Get the logged-in user's profile
router.get(
  "/me",
  authController.authTestMiddleware,
  userController.getCurrentUser
);

// Update the logged-in user's profile
router.put(
  "/me",
  authController.authTestMiddleware,
  userController.updateCurrentUser
);

// Delete the logged-in user's account
router.delete(
  "/me",
  authController.authTestMiddleware,
  userController.deleteUser
);

router.get(
  "/me/posts",
  authController.authTestMiddleware,
  userController.getUserPosts
);

export default router;
