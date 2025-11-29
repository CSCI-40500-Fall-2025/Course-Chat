import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAPIBaseURL } from "../config/config";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { type ChatResponse, type Message } from "../models/Message";
import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import Navbar from "../components/Navbar";
import { TbTrash } from "react-icons/tb";
import { toast } from "react-toastify";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { IoIosClose, IoMdClose } from "react-icons/io";

const api = getAPIBaseURL();

const CourseChatPage = () => {
  const location = useLocation();
  const { course } = location.state;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const messageEndRef = React.useRef<HTMLDivElement | null>(null);
  const [showML, setShowML] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get<ChatResponse>(
        `${api}/api/chats/${course._id}/messages`
      );
      setMessages(res.data.messages);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchSummary = async () => {
    try {
      setIsSummarizing(true);
      const res = await axios.get(`${api}/api/chats/${course._id}/summarizer`);
      setSummary(res.data.message);
    } catch (error) {
      toast.warn("Error in generating summary.");
      handleError(error);
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const newSocket = io(api, {
      withCredentials: true,
    });
    setSocket(newSocket);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count === 15) {
        setShowML(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && course._id) {
      socket.emit("joinCourseChat", course._id);
      socket.on("recieveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
      socket.on("messageDeleted", (msgs) => {
        setMessages(msgs);
      });
    }
  }, [socket]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.warn("Type something to send a message.");
      return;
    }
    socket?.emit("sendMessage", {
      courseId: course._id,
      userId: user?._id,
      content: newMessage,
    });
    setNewMessage("");
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      socket?.emit("deleteMessage", {
        courseId: course._id,
        messageId: messageId,
      });
    } catch (error) {
      toast.warn("Error deleting Message.");
      handleError(error);
    }
  };

  const handleMLClicked = () => {
    setShowML(false);
    setIsModalOpen(true);
    fetchSummary();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 pt-16 dark:bg-zinc-700">
      <Navbar />
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {showML && (
          <div className="flex p-1.5 rounded-xl items-center left-1/2 top-1/8 bg-gray-300 dark:bg-neutral-900 -translate-x-1/2 gap-2 z-1 dark:text-white transition-all duration-200 fixed hover:opacity-80 animated-open">
            <FaWandMagicSparkles className="text-blue-500" />
            <p
              className="font-medium hover:cursor-pointer dark:hover:text-gray-400 hover:text-gray-500 transition duration-200"
              onClick={handleMLClicked}
            >
              Use Our Summarizer!
            </p>
            <IoIosClose
              size={15}
              onClick={() => setShowML(false)}
              className="hover:cursor-pointer hover:text-red-500 transition"
            />
          </div>
        )}
        {messages.map((msg) => {
          const isCurrentUser = msg.sender._id === user?._id;
          return (
            <div
              ref={messageEndRef}
              key={msg._id}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {/* Profile IMage if it is somebody ELSE NOT CURR USER */}
              {!isCurrentUser && (
                <img
                  src={msg.sender.profileImageURL}
                  alt={msg.sender.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              {/* MESSAGE BUBBLEE*/}
              <div className="">
                {isCurrentUser && (
                  <div
                    className=" hover:cursor-pointer flex justify-end"
                    onClick={() => handleDeleteMessage(msg._id)}
                  >
                    <TbTrash className="text-red-500 hover:scale-110 transition" />
                  </div>
                )}
                {/* USERNAME FOR BUBBLE */}
                {!isCurrentUser && (
                  <span className="text-xs text-gray-500 mb-1 ml-1">
                    {msg.sender.username}
                  </span>
                )}

                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow ${
                    isCurrentUser
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-400"
                  }`}
                >
                  {msg.content}
                </div>
                {/* Use provided mongodb createdAt */}
                <span className="text-[10px] text-gray-400 mt-1 self-end">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>
              {/* Profile Image if IS THE CURR USER */}
              {isCurrentUser && (
                <img
                  src={msg.sender.profileImageURL}
                  alt={msg.sender.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 flex items-center gap-2 border-t bg-white dark:bg-zinc-700"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          Send
        </button>
      </form>
      {/* Modal to show ML summary */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 dark:bg-gray-800 text-black dark:text-white">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl">Summary:</h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer"
              >
                <IoMdClose />
              </button>
            </div>{" "}
            {isSummarizing ? (
              <p> AI is currently summarizing... </p>
            ) : (
              <p className="text-sm text-center mt-1"> {summary} </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseChatPage;
