import "./App.css";
import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import routes from "./routes/index.tsx";
import Navbar from "./components/Navbar.tsx";

function App() {
  const element = useRoutes(routes);
  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>{element}</Suspense>
    </>
  );
}

export default App;
