import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { isPasswordComplex, isUsernameComplex } from "../utils/validators.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../logger.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!isUsernameComplex(username)) {
      logger.info("Username complexity not met.");
      return res.status(400).json({
        message:
          "Username must start with a letter, must be between 3 and 16 characters, and can contain letters, numbers, and underscores.",
      });
    }

    if (!isPasswordComplex(password)) {
      logger.info("Password complexity not met.");
      return res.status(400).json({
        message:
          "Password must be a minimum of eight characters, with one uppercase, one lowercase, one number, and one special character",
      });
    }

    //check for all fields
    if (!username || !email || !password) {
      logger.info("All fields required for signup.");
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("User already exists (signup)");
      return res.status(400).json({ message: "Email already in use" });
    }
    //hash password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImageURL:
        "https://res.cloudinary.com/dmicnvn4v/image/upload/v1762366312/default-avatar-icon-of-social-media-user-vector_reklhm.jpg",
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    logger.info("Sign up Successful.");

    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileImageURL:
          "https://res.cloudinary.com/dmicnvn4v/image/upload/v1762366312/default-avatar-icon-of-social-media-user-vector_reklhm.jpg",
      },
      token,
    });
  } catch (error) {
    logger.error(`Error with signup: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check for both fields and if email exists in db
    if (!email || !password) {
      logger.info("All fields required for login.");
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn("User does not exist (login)");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    //check if pswd matches with hashed
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info("Login Successful.");
    return res.status(200).json({
      message: "User Logged in Successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImageURL: user.profileImageURL,
      },
      token,
    });
  } catch (error) {
    logger.error(`Error with login: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

export const upload = async (req, res) => {
  try {
    const { email } = req.user;
    const { profileImageURL } = req.body;
    if (!profileImageURL) {
      return res
        .status(400)
        .json({ message: "Image URL required for upload." });
    }
    const uploadResult = await cloudinary.uploader.upload(profileImageURL, {
      folder: "profile_images",
      public_id: email,
      overwrite: true,
    });
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { profileImageURL: uploadResult.secure_url } },
      { new: true }
    );
    logger.info("Upload Successful.");

    return res.status(200).json({
      message: "Image uploaded successfully",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        profileImageURL: updatedUser.profileImageURL,
      },
    });
  } catch (error) {
    logger.error(`Image uploading error: ${error.message}`);
    return res.status(500).json({ message: "Server error during upload" });
  }
};

// test for middleware, get userdata by verifying token/middleware

export const getUserData = async (req, res) => {
  try {
    // req.user is already attached by middleware
    return res.status(200).json({
      message: "User data fetched successfully",
      user: req.user,
    });
  } catch (error) {
    logger.error(`Error with middleware: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};
