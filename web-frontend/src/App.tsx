import "./App.css";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes/index.tsx";
import Navbar from "./components/Navbar.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";

function App() {
  const element = useRoutes(routes);
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>
      <ToastContainer />
    </>
  );
}

export default App;
