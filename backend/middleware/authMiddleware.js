import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";
import logger from "../logger.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    logger.error("Error in middleware", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
