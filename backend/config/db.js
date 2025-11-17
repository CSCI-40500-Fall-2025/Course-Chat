import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../logger.js";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.debug(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1); // 1: connection failure, 0: connection success
  }
};

export default connectDB;
