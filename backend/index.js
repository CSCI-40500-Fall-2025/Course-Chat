import express from "express";
import connectDB from "./config/db.js";
import userroutes from "./routes/user-auth.js";
import chatRoutes from "./routes/chat.js";
import announcementRoutes from "./routes/announcements.js";
import cors from "cors";
import courseRoutes from "./routes/courses.js";
import "dotenv/config";
import { connectCloudinary } from "./config/cloudinary.js";
import { initSocket } from "./chat/socket.js";
import http from "http";

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);

connectDB();
connectCloudinary();

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://course-chat-frontend.onrender.com",
    ],
    credentials: true,
  })
);

app.use("/api", userroutes);
app.use("/api", courseRoutes);
app.use("/api", chatRoutes);
app.use("/api", announcementRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello registration");
});

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
