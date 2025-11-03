import React from "react";
import type { Course } from "../models/Course";

const CourseCard: React.FC<Course> = (props) => {
  return (
    <>
      <div className=" bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition flex flex-col justify-between">
        <h3 className="text-2xl font-bold text-blue-600 mb-2">{props.code}</h3>
        <h3 className="text-lg font-bold text-blue-600 mb-2">{props.title}</h3>
        <p className=" mb-1">{props.courseStatus}</p>
        {/* props.courseId not displayed */}
      </div>
    </>
  );
};

export default CourseCard;
