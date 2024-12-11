const Posts = require("../models/posts_model");
const mongoose = require("mongoose");

const addNewPost = async (req, res) => {
  try {
    title = req.body.title;
    content = req.body.content;
    if (!title || !content) {
      return res
        .status(400)
        .send({ status: "Error", message: "Title and content are required" });
    }
    const post = await Posts.create(req.body);
    return res.status(201).send({ status: "Success", data: post });
  } catch (err) {
    return res.status(500).send({ status: "Error", message: err.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const filter = req.query;
    let posts;
    if (filter.sender) {
      // if the query string contains a sender, filter the posts by that sender
      posts = await Posts.find({ sender: filter.sender });
    } else {
      // if there is no sender in the query string, get all posts
      posts = await Posts.find();
    }
    return res.status(200).send({ status: "Success", data: posts });
  } catch (err) {
    return res.status(500).send({ status: "Error", message: err.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId);
    if (!post) {
      return res
        .status(404)
        .send({ status: "Error", message: "Post not found" });
    }
    return res.status(200).send({ status: "Success", data: post });
  } catch (err) {
    return res.status(400).send({ status: "Error", message: err.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const updateData = req.body;
    // Update the post and return the updated document
    const updatedPost = await Posts.findByIdAndUpdate(
      postId, // The ID of the post to update
      updateData, // The data to update
      { new: true, runValidators: true } // Options: return the updated document and validate the update
    );
    if (!updatedPost) {
      return res
        .status(404)
        .send({ status: "Error", message: "Post not found" });
    }
    return res.send({ status: "Success", data: updatedPost });
  } catch (err) {
    return res.status(400).send({ status: "Error", message: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findByIdAndDelete(postId);
    if (!post) {
      return res
        .status(404)
        .send({ status: "Error", message: "Post not found" });
    }
    return res.status(200).send({ status: "Success", data: "" });
  } catch (err) {
    return res.status(400).send({ status: "Error", message: err.message });
  }
};
module.exports = {
  addNewPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
