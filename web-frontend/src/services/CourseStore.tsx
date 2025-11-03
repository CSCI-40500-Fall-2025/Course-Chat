import axios from "axios";
import {
  type Course,
  type CourseStore,
  type Coursepayload,
} from "../models/Course";
import { handleError } from "../helpers/ErrorHandler";
import { create } from "zustand";
import { toast } from "react-toastify";

const api = "http://localhost:5001/api"; // change with env later

export const useCourseStore = create<CourseStore>()((set, get) => ({
  courses: [],
  loadCourses: async () => {
    try {
      const res = await axios.get<Coursepayload>(api + "/me/courses");
      console.log(res.data);
      set({ courses: res.data.courses ?? [] });
      toast.success(res.data.message);
    } catch (error) {
      handleError(error);
    }
  },
  addCourse: async (value: Course) => {
    try {
      const res = await axios.post(api + "/me/addcourse/" + value.courseId);
      //recall loadCourses since addcourse route returns mongodb reference to the course table
      await get().loadCourses();
    } catch (error) {
      handleError(error);
    }
  },
}));
