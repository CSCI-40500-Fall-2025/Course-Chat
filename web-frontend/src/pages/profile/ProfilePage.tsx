import React from "react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  return (
    <>
      <Link to="/dashboard" className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>
      <p>Image Placeholder</p>
      <h1> First Name Last Name</h1>
      <p>Dark Mode button</p>
    </>
  );
};

export default ProfilePage;
