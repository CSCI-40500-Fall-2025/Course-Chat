import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAPIBaseURL } from "../config/config";
import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { type Announcement } from "../models/Announcement";
import AnnouncementCard from "../components/AnnouncementCard";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const api = getAPIBaseURL();

const AnnouncementsPage = () => {
  const location = useLocation();
  const { user, isReady, token } = useAuth();
  const { course } = location.state;
  const courseId = course._id;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((s) => s._id !== id));
  };

  const handleUpdateAnnouncement = (updatedAnnouncement: Announcement) => {
    setAnnouncements((prev) =>
      prev.map((s) =>
        s._id === updatedAnnouncement._id ? updatedAnnouncement : s
      )
    );
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${api}/api/announcements/${courseId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAnnouncements(res.data.announcements);
    } catch (error) {
      handleError(error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setTitle("");
    setContent("");
  };

  const handleCreateAnnouncement = async () => {
    try {
      setIsSubmitting(true);
      if (!title.trim() || !content.trim()) {
        toast.warn("Please fill out both fields to create an announcement.");
        return;
      }
      const res = await axios.post(
        `${api}/api/announcements/${courseId}`,
        {
          title,
          content,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setAnnouncements([res.data.announcement, ...announcements]);
      handleModalClose();
      toast.success("Announcement created successfully.");
    } catch (error) {
      toast.warn(
        "Error in making announcement. Make sure all fields are filled out."
      );
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user && isReady && token) {
      fetchAnnouncements();
    }
  }, [user, isReady, token]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center items-center dark:bg-zinc-700 dark:text-white min-h-screen">
        <h1 className="text-2xl mt-3"> Announcements:</h1>
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 hover:cursor-pointer active:scale-95 transition-all shadow-md"
          onClick={() => setModalOpen(true)}
        >
          Create an Announcement
        </button>
        {/* Map out Announcements using Announcement Card component */}
        <div className="w-full max-w-4xl mt-6">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id.toString()}
                announcement={announcement}
                onDelete={handleDeleteAnnouncement}
                onUpdate={handleUpdateAnnouncement}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No Announcements currently.
            </p>
          )}
        </div>
        {/* Modal to create announcement */}
        {modalOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Create Announcement
                </h2>
                <button
                  onClick={handleModalClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer"
                >
                  <IoMdClose />
                </button>
              </div>
              {/* Inputs (title, content) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter announcement title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter announcement content"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AnnouncementsPage;
