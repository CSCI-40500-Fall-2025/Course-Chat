import "dotenv/config";
import express from "express";
import connectDB from "./config/db.js";
import userroutes from "./routes/user-auth.js";
import chatRoutes from "./routes/chat.js";
import announcementRoutes from "./routes/announcements.js";
import mlRoutes from "./routes/ml.js";
import cors from "cors";
import courseRoutes from "./routes/courses.js";
import { connectCloudinary } from "./config/cloudinary.js";
import { initSocket } from "./chat/socket.js";
import http from "http";
import logger from "./logger.js";

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);

logger.debug("Logger is working!");
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
app.use("/api", mlRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello registration");
});

app.get("/log-test", (req, res) => {
  logger.warn("Testing CloudWatch logging from Express!");
  res.send("Logged to Cloudwatch");
});

initSocket(server);

server.listen(PORT, () => {
  logger.debug(`Server is running on port ${PORT}`);
});

export default app;
