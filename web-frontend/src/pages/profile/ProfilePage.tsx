import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getAPIBaseURL } from "../../config/config";

const api = getAPIBaseURL();

const ProfilePage = () => {
  const { user, token, updateProfileImage } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file)); // Local preview
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
            api + "/me/uploadimage",
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
      <div className="p-10">
        <Link to="/dashboard" className="text-blue-500 mb-4 inline-block">
          ← Back
        </Link>
        <div className="flex flex-col items-center">
          <img
            src={user?.profileImageURL}
            width="200"
            height="200"
            className=" mb-10"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
          <p> Upload a new profile Image?</p>
          <p> Hey {user?.username}</p>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
