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

//route: /chats/:courseId/:messageId
export const deleteMessage = async (req, res) => {
  try {
    const { courseId, messageId } = req.params;
    let chat = await Chat.findOne({ course: courseId });
    if (!chat) {
      return res
        .status(400)
        .json({ message: "No Chatroom to delete message from" });
    }

    chat.messages = chat.messages.filter((msg) => msg.toString() !== messageId);
    await chat.save();

    await Message.findByIdAndDelete(messageId);

    logger.info("Message deleted successfully");
    return res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    logger.error(`Error deleting message: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server Error: Could not delete message" });
  }
};
