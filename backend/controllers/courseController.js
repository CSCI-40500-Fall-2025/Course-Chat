import Course from "../models/course.js";
import User from "../models/user.js";

// get users from specific course
export const getUsers = async (req, res) => {
  try {
    const { courseid } = req.params;
    const courseExists = await Course.findOne({ courseId: courseid }).populate(
      "users"
    );
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }

    return res
      .status(200)
      .json({
        users: courseExists.users,
        message: "Users grabbed successfully.",
      });
  } catch (error) {
    console.log("Error in getting users from course: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not get users." });
  }
};
// user gets their corresponding courses
export const getCourses = async (req, res) => {
  try {
    // get email since emails are unique
    const { email } = req.user;
    // get populated courses field instead of just references
    const user = await User.findOne({ email }).populate("courses");
    return res
      .status(200)
      .json({ courses: user.courses, message: "Got courses successfully." });
  } catch (error) {
    console.log("Error in getting user courses: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not get user courses." });
  }
};

export const addCourse = async (req, res) => {
  //USES courseId from schema as search tool !!!
  try {
    const { email } = req.user;
    const { courseid } = req.params;

    const courseExists = await Course.findOne({ courseId: courseid });
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }
    // mongo uses _id for references to course object

    const user = await User.findOne({ email });
    // if user already has the course
    if (user.courses.includes(courseExists._id)) {
      return res.status(400).json({ message: "User already has the course" });
    }
    user.courses.push(courseExists._id);
    await user.save();
    // add user to list of users in the course
    if (!courseExists.users.includes(user._id)) {
      courseExists.users.push(user._id);
      await courseExists.save();
    }

    //stores reference use get to get full
    return res
      .status(200)
      .json({ message: "Course added successfully.", courses: user.courses });
  } catch (error) {
    console.log("Error adding course: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not add course." });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { email } = req.user;
    const { courseid } = req.params;
    console.log("Deleting course with courseId:", courseid);
    const courseExists = await Course.findOne({ courseId: courseid });
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }
    const user = await User.findOne({ email });
    if (!user.courses.includes(courseExists._id)) {
      return res
        .status(400)
        .json({ message: "User does not have the course." });
    }

    user.courses = user.courses.filter(
      (c) => c.toString() !== courseExists._id.toString()
    );
    await user.save();
    // Remove the user from course's users
    courseExists.users = courseExists.users.filter(
      (u) => u.toString() !== user._id.toString()
    );
    await courseExists.save();
    return res
      .status(200)
      .json({ message: "Course deleted successfully.", courses: user.courses });
  } catch (error) {
    console.log("Error adding course: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not delete course." });
  }
};
