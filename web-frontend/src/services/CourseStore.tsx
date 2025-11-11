import axios from "axios";
import {
  type Course,
  type CourseStore,
  type Coursepayload,
} from "../models/Course";
import { handleError } from "../helpers/ErrorHandler";
import { create } from "zustand";
import { toast } from "react-toastify";
import { getAPIBaseURL } from "../config/config";

const api = getAPIBaseURL();

export const useCourseStore = create<CourseStore>()((set, get) => ({
  courses: [],
  loadCourses: async (token?: string) => {
    try {
      const res = await axios.get<Coursepayload>(api + "/api/me/courses", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // console.log(res.data);
      set({ courses: res.data.courses ?? [] });
    } catch (error) {
      handleError(error);
    }
  },
  addCourse: async (value: Course, token?: string) => {
    try {
      const res = await axios.post(
        api + "/api/me/addcourse/" + value.courseId,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      //recall loadCourses since addcourse route returns mongodb reference to the course table
      await get().loadCourses(token);
      toast.success(res.data.message);
    } catch (error) {
      handleError(error);
    }
  },
  deleteCourse: async (value: Course, token?: string) => {
    try {
      const res = await axios.delete(
        api + "/api/me/deletecourse/" + value.courseId,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      await get().loadCourses(token);
      toast.success(res.data.message);
    } catch (error) {
      handleError(error);
    }
  },
}));
