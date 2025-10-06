import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const SignUpPage = () => {
  const { registerUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    await registerUser(username, email, password);
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-20 p-4 border rounded">
        <Link to="/" className="text-blue-500 mb-4 inline-block">
          ←Back
        </Link>
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form className="flex flex-col gap-3" onSubmit={handleSignup}>
          <input
            type="username"
            placeholder="username"
            className="border px-3 py-2 rounded"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="border px-3 py-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            className="border px-3 py-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="confirm password"
            className="border px-3 py-2 rounded"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUpPage;
