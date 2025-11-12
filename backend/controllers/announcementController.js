import Announcement from "../models/announcement.js";
import Course from "../models/course.js";

// use course _id
// POST api route: /api/announcements/:courseId
export const addAnnouncement = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content } = req.body;
    const creator = req.user._id;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ message: "Course not found to add announcement to." });

    const announcement = new Announcement({
      title,
      content,
      creator,
    });
    await announcement.save();

    course.announcements.push(announcement._id);
    await course.save();

    return res
      .status(201)
      .json({ message: "Announcement created successfully.", announcement });
  } catch (error) {
    console.log("Error adding announcement: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not add announcement." });
  }
};

// edit an announcement
// uses announcement id, authmiddleware
// PUT route: /api/announcements/:announcementId
export const updateAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;
    const { title, content } = req.body;
    const announcement = await Announcement.findById(announcementId);
    if (!announcement)
      return res.status(404).json({ message: "Announcement not found " });

    if (announcement.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit." });
    }

    if (announcement.title == title && announcement.content == content) {
      return res
        .status(400)
        .json({ message: "Should be some difference when editing." });
    }
    announcement.title = title;
    announcement.content = content;
    await announcement.save();

    return res
      .status(200)
      .json({ message: "Announcement updated successfully", announcement });
  } catch (error) {
    console.log("Error updating announcement: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not update announcement." });
  }
};

// delete an announcement
// uses announcement id params, middleware, only creator
// DELETE route, /api/announcements/:announcementId
export const deleteAnnouncement = async (req, res) => {
  try {
    const { announcementId } = req.params;

    const announcement = await Announcement.findById(announcementId);
    if (!announcement)
      return res.status(404).json({ message: "Announcement not found " });

    if (announcement.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit." });
    }

    await Course.updateMany(
      { announcements: announcementId },
      { $pull: { announcements: announcementId } }
    );

    await announcement.deleteOne();

    res.status(200).json({ message: "Announcement deleted successfuly." });
  } catch (error) {
    console.log("Error deleting announcement: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not delete announcement." });
  }
};

// GET announcements /api/announcements/:courseId
// get announcements from a course sorted newest to oldest
// using authmiddleware
export const getAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate({
      path: "announcements",
      populate: { path: "creator", select: "name email role" },
      options: { sort: { createdAt: -1 } },
    });
    if (!course)
      return res.status(404).json({ message: " Course not found. " });

    return res.status(200).json({ announcements: course.announcements });
  } catch (error) {
    console.log("Error getting Announcements: ", error.message);
    return res
      .status(500)
      .json({ message: "Server error: Could not get announcements." });
  }
};
