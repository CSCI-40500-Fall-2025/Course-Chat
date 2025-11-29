import logger from "../logger.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import Course from "../models/course.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// summarize Messages from a specific chat
// api/chats/:courseId/summarizer
export const summarizeMessages = async (req, res) => {
  try {
    const { courseId } = req.params;
    let chat = await Chat.findOne({ course: courseId });
    if (!chat) {
      logger.warn("Chat does not exist when summarizing.");
      return res.status(404).json({ message: "Chat does not exist." });
    }

    const messages = await Message.find({ chat: chat._id })
      .populate("sender", "username profileImageURL")
      .sort({ createdAt: 1 });
    const course = await Course.findById(courseId);
    const courseCode = course.code;
    const courseTitle = course.title;
    const courseStatus = course.courseStatus;
    const query = `Using the following messages data output a summary. \n \ 
    The data will start on the next line and will be a json object. Ignore all data besides sender.username and the content for each json object. You are summarizing for the course ${courseCode}, titled ${courseTitle}, with a status of ${courseStatus}. In the summary mention the course information.
     You are summarizing content from a course group chat. Summarize the content from each object and specify who sent what content when summarizing. DO NOT just list out who said what but instead just give a paragraph summary, keeping it short. Additionally, include key details on the course, assignments, projects, or any coursework for the course in the summary. Make the summary flow.  Here is the data: \n \
        ${messages}
    `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
    });
    return res.status(200).json({ message: response.text });
  } catch (error) {
    logger.error(`Error in summarizing message (ML): ${error.message}`);
    return res
      .status(400)
      .json({ message: "Server Error: Could not summarize messages" });
  }
};
