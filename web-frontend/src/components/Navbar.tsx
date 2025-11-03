import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { logout, user } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <header className="bg-blue-600 text-white shadow-md p-4 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <h1 className="text-2xl font-bold">Course Chat</h1>
      <nav>
        {user && (
          <span className="font-medium">
            Hello, {user.username || "Student"}
          </span>
        )}
        <Link
          to="/profile"
          className="px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="ml-4 px-3 py-1 bg-red-500 rounded hover:bg-red-600 hover:cursor-pointer transition"
        >
          Log Out
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
