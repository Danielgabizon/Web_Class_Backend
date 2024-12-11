import mongoose, { Schema } from "mongoose";

// Interface for the Post document
export interface IPost {
  sender: mongoose.Types.ObjectId; // Refers to a User ID
  title: string;
  content: string;
}

// Define the Posts schema
const postSchema = new Schema<IPost>({
  sender: {
    // Refers to the User ID
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
});

// Export the model
export default mongoose.model<IPost>("Post", postSchema);
