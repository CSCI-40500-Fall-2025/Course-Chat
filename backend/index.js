import express from "express";
import connectDB from "./config/db.js";
import userroutes from "./routes/user-auth.js";
import cors from "cors";
import courseRoutes from "./routes/courses.js";
import "dotenv/config";
import { connectCloudinary } from "./config/cloudinary.js";

const PORT = process.env.PORT || 5001;
const app = express();

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

app.get("/", (req, res) => {
  res.status(200).send("Hello registration");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
