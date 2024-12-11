import mongoose from "mongoose";

export interface IComment {
  postid: mongoose.Schema.Types.ObjectId;
  sender: number;
  content: string;
}

const Schema = mongoose.Schema;
const commentsSchema = new Schema<IComment>({
  postid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  sender: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IComment>("Comments", commentsSchema);
