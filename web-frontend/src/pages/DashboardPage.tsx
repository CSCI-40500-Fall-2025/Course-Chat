import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 mt-10">
        <h2 className="text-xl font-semibold mb-6">Hey Student</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/classes"
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-blue-600 mb-2">My Classes</h3>
            <p className="text-gray-600">
              View and manage your enrolled courses.
            </p>
          </Link>

          <Link
            to="/chats"
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-green-600 mb-2">
              Class Chats
            </h3>
            <p className="text-gray-600">
              Join discussions and collaborate with classmates.
            </p>
          </Link>

          <Link
            to="/updates"
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-purple-600 mb-2">Updates</h3>
            <p className="text-gray-600">
              Stay up to date with announcements and deadlines.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
