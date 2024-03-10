// Import necessary modules and dependencies
import CourseModel from "../models/CourseModel.js";
import StudentModel from "../models/StudentModel.js";

// Controller function to handle course creation
export const createCourse = async (req, res) => {
  try {
    // Parse request body to extract course details
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
    if (!name || !maxSeats || !startDate || !creatorId) {
      return res
        .status(400)
        .send({
          message: "Name, maxSeats, startDate, and creatorId are required.",
        });
    }

    // Create course in the database
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

    // Return success message along with the created course
    return res
      .status(201)
      .send({ success: true, message: "Course created successfully.", course });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error creating course.", error });
  }
};

// Controller function to handle updating course details
export const updateCourseDetails = async (req, res) => {
  try {
    // Parse request parameters
    const courseId = req.params.id;
    const updateData = req.body;

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .send({ success: false, message: "Course not found." });
    }

    // Check if the current user is the creator of the course
    if (!course.creatorId.equals(req.user._id)) {
      return res
        .status(403)
        .send({
          success: false,
          message: "You are not authorized to update this course.",
        });
    }

    // Update course details in the database
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    // Return success message along with the updated course
    return res
      .status(200)
      .send({
        success: true,
        message: "Course details updated successfully.",
        course: updatedCourse,
      });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Error updating course details.",
        error,
      });
  }
};

// Controller function to handle registering a student for a course
export const registerStudentForCourse = async (req, res) => {
  try {
    // Parse request body
    const courseId = req.params.id;
    const { name, email, phoneNumber, linkedinProfile } = req.body;

    // Validate input data
    if (!name || !email || !phoneNumber || !linkedinProfile) {
      return res
        .status(400)
        .send({
          message:
            "Name, email, phone number, and LinkedIn profile are required.",
        });
    }

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }

    // Find the student by matching name, email, phone number, and LinkedIn profile
    const student = await StudentModel.findOne({
      Name: name,
      Email: email,
      PhoneNumber: phoneNumber,
      linkedinProfile,
    });

    // If student not found, return error
    if (!student) {
      return res
        .status(404)
        .send({
          message:
            "Student not found. Please provide correct details or register as a student first.",
        });
    }

    // Add student ID to the waiting list of the course
    course.waitingLeads.push(student._id);
    await course.save();

    // Return success message
    return res
      .status(200)
      .send({
        success: true,
        message: "Student registered for the course successfully.",
      });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send({
        success: false,
        message: "Error registering student for the course.",
        error,
      });
  }
};

// Controller function to handle updating lead status
export const updateLeadStatus = async (req, res) => {
  try {
    // Parse request parameters
    const { courseId, leadId } = req.params;
    const { status } = req.body;

    // Validate input data
    if (!status || !["accepted", "rejected", "waiting"].includes(status)) {
      return res
        .status(400)
        .send({
          message:
            "Invalid status value. Status must be 'accepted', 'rejected', or 'waiting'.",
        });
    }

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }

    // Check if the user making the request is the creator of the course
    if (course.creatorId.toString() !== req.user._id) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this lead." });
    }

    // Find the lead by ID
    const lead = await StudentModel.findById(leadId);
    if (!lead) {
      return res.status(404).send({ message: "Lead not found." });
    }

    // Update the lead's status
    lead.status = status;

    // If status is updated to "accepted" or "rejected", move the lead to the corresponding list of the course
    if (status === "accepted") {
      course.waitingLeads.pull(leadId);
      course.acceptedLeads.push(leadId);
    } else if (status === "rejected") {
      course.waitingLeads.pull(leadId);
      course.rejectedLeads.push(leadId);
    }

    await Promise.all([lead.save(), course.save()]);

    // Return success message
    return res
      .status(200)
      .send({ success: true, message: "Lead status updated successfully." });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error updating lead status.", error });
  }
};

// Controller function to handle searching leads
export const searchLeadsController = async (req, res) => {
  try {
    // Parse query parameters
    const { keyword } = req.query;

    // Validate input data
    if (!keyword) {
      return res
        .status(400)
        .send({ message: "Keyword parameter is required for search." });
    }

    // Search for leads in the StudentModel by name or email
    const results = await StudentModel.find({
      $or: [
        { Name: { $regex: keyword, $options: "i" } }, // Case-insensitive regex search for name
        { Email: { $regex: keyword, $options: "i" } }, // Case-insensitive regex search for email
      ],
    });

    // Return search results
    return res.status(200).send({ success: true, results });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error in searchLeads API", error });
  }
};
