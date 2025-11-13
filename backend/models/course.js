import mongoose from "mongoose";
const Schema = mongoose.Schema;

// code,title,course_id,status
const courseSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
  },
  courseStatus: {
    type: String,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  announcements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Announcement",
      default: [],
    },
  ],
});

export default mongoose.model("Course", courseSchema);
