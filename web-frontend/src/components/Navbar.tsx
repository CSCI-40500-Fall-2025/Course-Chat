import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <h1 className="text-2xl font-bold">Course Chat</h1>
      <nav>
        <Link
          to="/profile"
          className="px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Profile
        </Link>
        <Link
          to="/"
          className="ml-4 px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition"
        >
          Log Out
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
