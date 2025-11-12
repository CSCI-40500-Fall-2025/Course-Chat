import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAPIBaseURL } from "../config/config";
import axios from "axios";
import { handleError } from "../helpers/ErrorHandler";
import { type Announcement } from "../models/Announcement";

const api = getAPIBaseURL();

const AnnouncementsPage = () => {
  const location = useLocation();
  const { user, isReady, token } = useAuth();
  const { course } = location.state;
  const courseId = course._id;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

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
  useEffect(() => {
    if (user && isReady && token) {
      fetchAnnouncements();
    }
  }, [user, isReady, token]);
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl mt-3"> Announcements:</h1>
      {/* Map out Announcements using Announcement Card component */}
    </div>
  );
};

export default AnnouncementsPage;
