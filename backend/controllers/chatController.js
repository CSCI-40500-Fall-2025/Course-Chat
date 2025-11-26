import logger from "../logger.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";

// instead of like in courseController this one uses _id for courseId
export const getMessages = async (req, res) => {
  try {
    const { courseId } = req.params;

    let chat = await Chat.findOne({ course: courseId });
    if (!chat) {
      chat = await Chat.create({ course: courseId });
    }

    const messages = await Message.find({ chat: chat._id })
      .populate("sender", "username profileImageURL")
      .sort({ createdAt: 1 });
    logger.info("Messages fetched successfully.");
    console.log(messages);
    return res.status(200).json({
      chatId: chat._id,
      course: chat.course,
      messages,
    });
  } catch (error) {
    logger.error(`Error getting messages: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server Error: Could not get messages " });
  }
};

/*
  Functions such as:
  connect, disconnect, sendmessage, deletemessage are all located in:
  chat/socket.js

*/
