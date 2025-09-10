import React, { useState } from "react";
import { Link } from "react-router-dom";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for login logic
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <Link to="/" className="text-blue-500 mb-4 inline-block">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mb-4">Log In</h1>

      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded"
          required
        />
        <Link
          to="/dashboard"
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
        >
          Log In
        </Link>
      </form>
    </div>
  );
};

export default LogInPage;
