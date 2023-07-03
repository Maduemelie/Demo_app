import { Schema, model } from "mongoose";

const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      text: {
        type: String,
      },
    },
  ],
  rePost: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  image: {
    type: String,
  },
});

export default model("Post", PostSchema);
