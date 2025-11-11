import { Server } from "socket.io";
import Chat from "../models/chat.js";
import Message from "../models/message.js";

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
    console.log("User Connected: ", socket.id);

    socket.on("joinCourseChat", async (courseId) => {
      socket.join(courseId);
      console.log(`User ${socket.id} joined chat room: ${courseId}`);
    });

    socket.on("sendMessage", async ({ courseId, userId, content }) => {
      try {
        let chat = await Chat.findOne({ course: courseId });
        if (!chat) {
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
        io.to(courseId).emit("recieveMessage", populatedMessage);
      } catch (error) {
        console.error("Error sending message ", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected ", socket.id);
    });
  });
};
