import mongoose from "mongoose";
const Schema = mongoose.Schema;

// each chat corresponds to a course
const chatSchema = new Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

export default mongoose.model("Chat", chatSchema);
