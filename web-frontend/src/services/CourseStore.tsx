import axios from "axios";
import { type CourseStore, type Coursepayload } from "../models/Course";
import { handleError } from "../helpers/ErrorHandler";
import { create } from "zustand";
import { toast } from "react-toastify";

const api = "http://localhost:5001/api"; // change with env later

export const useCourseStore = create<CourseStore>()((set) => ({
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
}));
