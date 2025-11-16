import type { RouteObject } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignUpPage from "../pages/SignUpPage";
import LogInPage from "../pages/LogInPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import CourseSearchPage from "../pages/CourseSearchPage";
import CourseChatPage from "../pages/CourseChatPage";
import AnnouncementsPage from "../pages/AnnouncementsPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <HomePage />,
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
  {
    path: "/:code/announcements",
    element: <AnnouncementsPage />,
  },
];

export default routes;
