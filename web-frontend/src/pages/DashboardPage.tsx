import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen dark:bg-zinc-700 dark:text-white bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 mt-10">
        <h2 className="text-2xl font-semibold mt-6 items-center justify-center flex">
          My courses:
        </h2>
        {/* For now keep the things above but afterwards would be incorporated in CourseCard and deleted */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard
                key={course.courseId}
                _id={course._id}
                code={course.code}
                title={course.title}
                courseId={course.courseId}
                courseStatus={course.courseStatus}
                announcements={course.announcements}
              />
            ))
          ) : (
            <p></p>
          )}
          <button
            onClick={addCourseButtonHandler}
            className="flex items-center dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white justify-center h-48 bg-gray-200 rounded-2xl hover:shadow-lg hover:bg-gray-300 hover:cursor-pointer transition-all text-5xl font-bold text-gray-700"
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
