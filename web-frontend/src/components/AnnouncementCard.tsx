import { useState } from "react";
import type { Announcement } from "../models/Announcement";
import { TbTrashFilled, TbTrash } from "react-icons/tb";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { handleError } from "../helpers/ErrorHandler";
import { toast } from "react-toastify";
import axios from "axios";
import { getAPIBaseURL } from "../config/config";
import { useAuth } from "../contexts/AuthContext";

type AnnouncementCardProps = {
  announcement: Announcement;
  onDelete: (id: string) => void;
  onUpdate: (updated: Announcement) => void;
};

const api = getAPIBaseURL();

const AnnouncementCard = ({
  announcement,
  onDelete,
  onUpdate,
}: AnnouncementCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const { _id, title, content, creator, createdAt } = announcement;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useAuth();

  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const editModalOpen = () => {
    setEditedContent(announcement.content);
    setEditedTitle(announcement.title);
    setModalOpen(true);
  };

  const editModalClose = () => {
    setEditedContent("");
    setEditedTitle("");
    setModalOpen(false);
  };

  const handleEditAnnouncement = async () => {
    try {
      setIsSubmitting(true);
      if (
        editedTitle.trim() === announcement.title.trim() &&
        editedContent.trim() === announcement.content.trim()
      ) {
        toast.warn("Change something to edit.");
        return;
      }
      const res = await axios.put(
        `${api}/api/announcements/${_id}`,
        {
          title: editedTitle,
          content: editedContent,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(res.data.announcement);
      editModalClose();
      toast.success("Announcement edited successfully.");
    } catch (error) {
      toast.warn("Error editing announcement. Please try again.");
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    try {
      await axios.delete(`${api}/api/announcements/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(_id.toString());
      toast.success("Announcement deleted successfully.");
    } catch (error) {
      toast.warn("Error deleting announcement. Please try again.");
      handleError(error);
    }
  };
  return (
    <div className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-200x mt-1 ">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          {user?._id === creator._id && (
            <>
              <button
                className="rounded-lg hover:bg-blue-50 hover:cursor-pointer text-blue-600 transition-colors"
                title="Edit"
                onClick={editModalOpen}
              >
                <FiEdit2 size={18} />
              </button>
              <div
                className="hover:cursor-pointer transition"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handleDeleteAnnouncement}
              >
                {isHovering ? (
                  <TbTrashFilled className="text-red-500" size={18} />
                ) : (
                  <TbTrash className="text-red-500" size={18} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3">
        <div className="flex items-center gap-2">
          <span>{formattedDate}</span>
        </div>
        <span className="italic">By {creator.username}</span>
      </div>
      {/* Editing Announcement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Edit:</h2>
              <button
                onClick={editModalClose}
                className="text-gray-500 hover:text-gray-700 text-2xl hover:cursor-pointer"
              >
                <IoMdClose />
              </button>
            </div>
            {/* Inputs (title, content) */}
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Enter announcement title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  placeholder="Enter announcement content"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={editModalClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleEditAnnouncement}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Editing..." : "Edit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementCard;
