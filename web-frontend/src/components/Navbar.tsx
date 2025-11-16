import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const handleLogout = () => {
    logout();
  };
  return (
    <header className="bg-blue-600 text-white shadow-md p-4 flex justify-between items-center w-full fixed h-16 top-0 left-0 z-51 dark:bg-blue-800">
      <Link to={"/dashboard"}>
        <h1 className="text-2xl font-bold dark:hover:text-blue-400 hover:text-blue-200 transition duration-300">
          Course Chat
        </h1>
      </Link>
      <nav>
        <div className="p-2 inline-flex">
          <button
            onClick={toggleTheme}
            className="hover:cursor-pointer hover:opacity-80 transition px-3"
          >
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
        </div>
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
