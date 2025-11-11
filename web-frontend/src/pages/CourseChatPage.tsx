import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAPIBaseURL } from "../config/config";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import { type ChatResponse, type Message } from "../models/Message";
import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";

const api = getAPIBaseURL();

const CourseChatPage = () => {
  const location = useLocation();
  const { course } = location.state;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const messageEndRef = React.useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    fetchMessages();

    const newSocket = io(api, {
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && course._id) {
      socket.emit("joinCourseChat", course._id);
      socket.on("recieveMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
  }, [socket]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    socket?.emit("sendMessage", {
      courseId: course._id,
      userId: user?._id,
      content: newMessage,
    });
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 text-center font-bold text-xl shadow relative flex items-center justify-center">
        <Link
          to="/dashboard"
          className="absolute left-4 text-white hover:text-gray-200 transition"
        >
          ← Back
        </Link>
        {course.title} Chat
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
                {/* Use provided mongodb createdAt */}
                <span className="text-[10px] text-gray-400 mt-1 self-end">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
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
        className="p-4 flex items-center gap-2 border-t bg-white"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CourseChatPage;
