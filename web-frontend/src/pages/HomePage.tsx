import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold">Home Page</h1>
      <p>
        Welcome to Course Chat!
        <br />
        An app for students who need real-time communication for collaboration
        and class updates
      </p>
      <div className="flex space-x-4 mt-4 justify-center">
        <Link
          to="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
};

export default HomePage;
