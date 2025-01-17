import mongoose, { Schema } from "mongoose";

export interface IComment {
  postId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
}

const commentsSchema = new Schema<IComment>({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model<IComment>("Comments", commentsSchema);
