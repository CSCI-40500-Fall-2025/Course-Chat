import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-gray-800 px-6">
      <div className=" w-full max-w-md mx-auto p-4 rounded-2xl shadow-xl bg-white/70 p-5  ">
        <Link to="/" className="text-blue-500 mb-4 inline-block">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold mb-4 text-indigo-700">Log In</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            required
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-600 hover:scale-105 transition-transform duration-200 hover:cursor-pointer"
            disabled={loading}
          >
            {loading ? "Please Wait..." : "Log in "}
          </button>
        </form>
        <p className=" text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to={"/signup"} className="text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
