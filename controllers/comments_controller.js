const Comments = require("../models/comments_model");
const mongoose = require("mongoose");

const addNewComment = async (req, res) => {
  try {
    title = req.body.title;
    content = req.body.content;
    if (!title || !content) {
      return res.status(400).send("Title and content are required");
    }
    const Comment = await Comments.create({
      postid: req.params.postid,
      sender: req.body.sender,
      title: req.body.title,
      content: req.body.content,
    });
    return res.status(201).send(Comment);
  } catch (err) {
    return res.status(500).send(`Error creating Comment: ${err.message}`);
  }
};

const getAllCommentsByPost = async (req, res) => {
  try {
    const filter = req.params;
    let comments;
    if (filter.postid) {
      // if the query string contains a post id, filter the Comments by that post
      comments = await Comments.find({ postid: filter.postid });
    }
    return res.status(200).send(comments);
  } catch (err) {
    return res.status(500).send(`Error fetching Comments: ${err.message}`);
  }
};

const updateComment = async (req, res) => {
  try {
    const CommentId = req.params.id;
    const updateData = req.body;
    // Update the Comment and return the updated document
    const updatedComment = await Comments.findByIdAndUpdate(
      CommentId, // The ID of the Comment to update
      updateData, // The data to update
      { new: true, runValidators: true } // Options: return the updated document and validate the update
    );
    if (!updatedComment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    return res.send(updatedComment);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comments.findByIdAndDelete(commentId);
    if (!comment) {
      return res
        .status(404)
        .send({ status: "Error", message: "Comment not found" });
    }
    return res.status(204).send({ status: "Success", data: "" });
  } catch (err) {
    return res.status(500).send({ status: "Error", message: err.message });
  }
};

module.exports = {
  addNewComment,
  getAllCommentsByPost,
  updateComment,
  deleteComment,
};
