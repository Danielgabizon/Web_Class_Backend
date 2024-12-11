// importing Express and creating a Router instance:
const express = require("express");
const router = express.Router();
// importing the controller functions that will handle the logic for each route.
const commentController = require("../controllers/comments_Controller");
// setting Up the routes:
router.post("/:postid", commentController.addNewComment);
router.get("/:postid", commentController.getAllCommentsByPost);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);


//exporting the router so that it can be imported and used in other parts of application. F
module.exports = router;
