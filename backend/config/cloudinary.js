import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import logger from "../logger.js";

dotenv.config();

export const connectCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    logger.debug("Cloudinary connected.");
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
