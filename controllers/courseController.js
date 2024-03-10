import CourseModel from "../models/CourseModel.js";
import StudentModel from "../models/StudentModel.js";

export const createCourse = async (req, res) => {
  try {
    // Parse request body
    const creatorId = req.user._id;
    const {
      name,
      maxSeats,
      startDate,
      acceptedLeads,
      rejectedLeads,
      waitingLeads,
      description,
    } = req.body;

    // Validate input data
    console.log(name, maxSeats, startDate, creatorId);
    if (!name || !maxSeats || !startDate || !creatorId) {
      return res.status(400).send({
        message: "Name, maxSeats, startDate, and creatorId are required.",
      });
    }

    // Create course in database
    const course = await new CourseModel({
      name,
      maxSeats,
      startDate,
      acceptedLeads,
      rejectedLeads,
      waitingLeads,
      creatorId,
      description,
    }).save();

    return res
      .status(200)
      .send({ success: true, message: "Course created successfully.", course });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error creating course.", error });
  }
};


