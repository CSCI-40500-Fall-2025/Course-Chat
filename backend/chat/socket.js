import { Server } from "socket.io";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import logger from "../logger.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:4173",
        "https://course-chat-frontend.onrender.com",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  io.on("connection", (socket) => {
    logger.debug(`User Connected: ${socket.id}`);

    socket.on("joinCourseChat", async (courseId) => {
      socket.join(courseId);
      logger.info(`User ${socket.id} joined chat room: ${courseId}`);
    });

    socket.on("sendMessage", async ({ courseId, userId, content }) => {
      try {
        let chat = await Chat.findOne({ course: courseId });
        if (!chat) {
          logger.warn(
            "Course chat was not created so creating a chat for specified course."
          );
          chat = await Chat.create({ course: courseId });
        }

        const message = await Message.create({
          chat: chat._id,
          sender: userId,
          content,
        });
        chat.messages.push(message._id);
        await chat.save();
        const populatedMessage = await message.populate(
          "sender",
          "username profileImageURL"
        );
        logger.info(
          `Message sent successfully: User: ${populatedMessage.sender.username}, Content: ${populatedMessage.content}`
        );
        io.to(courseId).emit("recieveMessage", populatedMessage);
      } catch (error) {
        console.error("Error sending message ", error);
      }
    });

    socket.on("disconnect", () => {
      logger.debug(`User disconnected: ${socket.id}`);
    });
  });
};
