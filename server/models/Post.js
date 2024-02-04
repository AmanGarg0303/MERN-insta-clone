import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
    },
    likes: {
      type: [],
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
