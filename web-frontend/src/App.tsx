import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes/index.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "./contexts/ThemeContext.tsx";

function App() {
  const element = useRoutes(routes);
  const { theme } = useTheme();
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>
      <ToastContainer theme={theme} />
    </>
  );
}

export default App;
