import React from "react";
import { Link } from "react-router-dom";
const SignUpPage = () => {
  return (
    <>
      <div className="max-w-md mx-auto mt-20 p-4 border rounded">
        <Link to="/" className="text-blue-500 mb-4 inline-block">
          ←Back
        </Link>
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="password"
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="confirm password"
            className="border px-3 py-2 rounded"
            required
          />
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
