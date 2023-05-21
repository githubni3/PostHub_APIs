import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  user: {
    require: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  
  comments: [
    {
      name: String,
      comment: String
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Posts = mongoose.model("Posts", PostSchema);
