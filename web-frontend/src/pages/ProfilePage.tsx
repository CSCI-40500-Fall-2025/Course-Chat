import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAPIBaseURL } from "../config/config";
import Navbar from "../components/Navbar";

const api = getAPIBaseURL();

const ProfilePage = () => {
  const { user, token, updateProfileImage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const navigate = useNavigate();
  //const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // setPreview(URL.createObjectURL(file)); // Local preview
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.warn("Please select an image first");
      return;
    }
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        try {
          console.log("Uploading");
          const res = await axios.put(
            api + "/api/me/uploadimage",
            { profileImageURL: base64Image },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const newImageURL = res.data.user.profileImageURL;
          updateProfileImage(newImageURL);
          toast.success("Profile image updated successfully!");
        } catch (error) {
          console.error("Uploading error: ", error);
          toast.error("Failed to upload image. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("Uploading error: ", error);
      toast.error("Failed to upload image.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-10 mt-10 dark:bg-zinc-700 dark:text-white min-h-screen">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 mb-4 inline-block dark:text-blue-400 hover:cursor-pointer"
        >
          ← Back
        </button>
        <div className="flex flex-col items-center gap-6">
          <img
            src={user?.profileImageURL}
            className="w-48 h-48 rounded-full object-cover mb-10 border-4 border-white dark:border-zinc-500 shadow-lg"
          />
          <h2 className="text-2xl font-semibold dark:text-white">
            Hey {user?.username}!
          </h2>
          <div className="w-full flex flex-col items-center gap-4">
            <label className="w-full text-center flex flex-col items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Upload a new profile image.
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hover:cursor-pointer pt-4 items-center text-gray-900 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 hover:file:cursor-pointer"
              />
            </label>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 hover:cursor-pointer disabled:opacity-60 transition"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
