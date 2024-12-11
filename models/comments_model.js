const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const commentsSchema = new Schema({
  sender: {
    type: Number,
    required: true,
  },
  postid: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
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

module.exports = mongoose.model("Comments", commentsSchema);
