import express from "express";
import connectDB from "./config/db.js";
import authroutes from "./routes/user-auth.js";

const PORT = process.env.PORT || 5001;
const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authroutes);

app.get("/", (req, res) => {
  res.status(200).send("Hello registration");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
