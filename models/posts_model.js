const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postsSchema = new Schema({
  sender: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
