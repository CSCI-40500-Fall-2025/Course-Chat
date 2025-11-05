import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { useCourseStore } from "../services/CourseStore";
import CourseCard from "../components/CourseCard";
//
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isReady, token } = useAuth();
  const { loadCourses, courses } = useCourseStore();
  useEffect(() => {
    if (user && isReady && token) {
      useCourseStore.setState({ courses: [] });

      loadCourses(token);
    }
  }, [user?.email, isReady]);

  const addCourseButtonHandler = () => {
    navigate("/courses");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 mt-10">
        <h2 className="text-xl font-semibold mb-6">Hey {user?.username}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/classes"
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-blue-600 mb-2">My Classes</h3>
            <p className="text-gray-600">
              View and manage your enrolled courses.
            </p>
          </Link>

          <Link
            to="/chats"
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-green-600 mb-2">
              Class Chats
            </h3>
            <p className="text-gray-600">
              Join discussions and collaborate with classmates.
            </p>
          </Link>

          <Link
            to="/updates"
            className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between"
          >
            <h3 className="text-lg font-bold text-purple-600 mb-2">Updates</h3>
            <p className="text-gray-600">
              Stay up to date with announcements and deadlines.
            </p>
          </Link>
        </div>

        {/* For now keep the things above but afterwards would be incorporated in CourseCard and deleted */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.courseId}
                code={course.code}
                title={course.title}
                courseId={course.courseId}
                courseStatus={course.courseStatus}
              />
            ))
          ) : (
            <p></p>
          )}
          <button
            onClick={addCourseButtonHandler}
            className="flex items-center justify-center h-48 bg-gray-200 rounded-2xl hover:shadow-lg hover:bg-gray-300 hover:cursor-pointer transition-all text-5xl font-bold text-gray-700"
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
