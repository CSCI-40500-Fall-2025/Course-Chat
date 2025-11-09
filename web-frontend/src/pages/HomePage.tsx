import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-gray-800 px-6">
      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700 animate-fadeIn">
          Course Chat
        </h1>
        <p className="text-lg leading-relaxed mb-6 text-gray-600">
          Welcome to{" "}
          <span className="font-semibold text-indigo-600">Course Chat</span>!
          <br />A place for students to connect, collaborate, and stay updated
          in real-time.
        </p>

        <div className="flex space-x-4 justify-center">
          <Link
            to="/login"
            className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl font-medium shadow-md hover:bg-indigo-600 hover:scale-105 transition-transform duration-200"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-medium shadow-md hover:bg-green-600 hover:scale-105 transition-transform duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
