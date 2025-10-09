import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check for all fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
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
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.log("Error with signup:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check for both fields and if email exists in db
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
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

    return res.status(200).json({
      message: "User Logged in Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("Error with login:", error.message);
    return res.status(500).json({ message: "Server error" });
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
    console.log("Error with getUserData:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
