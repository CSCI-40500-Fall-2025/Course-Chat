import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import CourseSearchPage from "../pages/CourseSearchPage";
import CourseChatPage from "../pages/CourseChatPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/login",
    element: <LogInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/courses",
    element: <CourseSearchPage />,
  },
  {
    path: "/:code/chat",
    element: <CourseChatPage />,
  },
];

export default routes;
