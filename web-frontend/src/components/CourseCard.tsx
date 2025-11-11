import React, { useState } from "react";
import type { Course } from "../models/Course";
import { TbTrashFilled, TbTrash } from "react-icons/tb";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useCourseStore } from "../services/CourseStore";
import { useNavigate } from "react-router-dom";
import slugify from "../utils/slugify";

const CourseCard: React.FC<Course> = (props) => {
  const [isHovering, setIsHovering] = useState(false);
  const { deleteCourse } = useCourseStore();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const delCourse = (value: Course) => {
    if (token) {
      deleteCourse(value, token);
    } else {
      navigate("/login");
    }
  };

  const handleJoinChat = () => {
    const code = slugify(props.code);
    navigate(`/${code}/chat`, { state: { course: props } });
  };

  return (
    <>
      <div className=" bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between">
        <div className="flex flex-row justify-between">
          <h3 className="text-2xl font-bold text-blue-600 mb-2">
            {props.code}
          </h3>
          <div
            className="hover:cursor-pointer transition"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => delCourse(props)}
          >
            {isHovering ? (
              <TbTrashFilled className="text-red-500" size={22} />
            ) : (
              <TbTrash className="text-red-500" size={22} />
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold text-blue-600 mb-2">{props.title}</h3>
        <button
          onClick={handleJoinChat}
          className=" flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 hover:cursor-pointer active:scale-95 transition-all shadow-md"
        >
          Join Group Chat <IoChatbubbleEllipsesOutline className="text-lg" />{" "}
        </button>
        <p className=" mb-1">{props.courseStatus}</p>
        {/* props.courseId not displayed */}
      </div>
    </>
  );
};

export default CourseCard;
