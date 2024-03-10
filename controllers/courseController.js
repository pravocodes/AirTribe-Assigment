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
      return res.status(403).send({
        success: false,
        message: "You are not authorized to update this course.",
      });
    }

    // Update course details in database
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      updateData,
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Course details updated successfully.",
      course: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error updating course details.",
      error,
    });
  }
};

export const registerStudentForCourse = async (req, res) => {
  try {
    // Parse request body
    const courseId = req.params.id;
    const { name, email, phoneNumber, linkedinProfile } = req.body;

    // Validate input data
    if (!name || !email || !phoneNumber || !linkedinProfile) {
      return res.status(400).send({
        message:
          "Name, email, phone number, and LinkedIn profile are required.",
      });
    }

    // Find the course by ID
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }

    console.log(name, email, phoneNumber, linkedinProfile);

    // Find the student by matching name, email, phone number, and LinkedIn profile
    const student = await StudentModel.findOne({
      Name: name,
      Email: email,
      PhoneNumber: phoneNumber,
      linkedinProfile,
    });

    // If student not found, return error
    if (!student) {
      return res.status(404).send({
        message:
          "Data Provided is not match as Student, Provide Correct details or Register as Student First",
      });
    }

    // Add student ID to the waiting list of the course
    course.waitingLeads.push(student._id);
    await course.save();

    return res.status(200).send({
      success: true,
      message: "Student registered for the course successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error registering student for the course.",
      error,
    });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    // Parse request parameters
    const { courseId, leadId } = req.params;
    const { status } = req.body;

    // Validate input data
    if (!status || !["accepted", "rejected", "waiting"].includes(status)) {
      return res.status(400).send({
        message:
          "Invalid status value. Status must be 'accepted', 'rejected', or 'waiting'.",
      });
    }
    // Check if the user making the request is the creator of the course
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found." });
    }
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

    return res
      .status(200)
      .send({ success: true, message: "Lead status updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error updating lead status.", error });
  }
};

// Function to search leads
export const searchLeadsController = async (req, res) => {
    try {
        // Destructure the request body
        const { name, email } = req.body;

        let leads;
        // If both name and email are provided, search by both
        if (name && email) {
            leads = await LeadsModel.find({
                name: new RegExp(name, 'i'),
                email: new RegExp(email, 'i')
            });
        } 
        // If only name is provided, search by name
        else if (name) {
            leads = await LeadsModel.find({ name: new RegExp(name, 'i') });
        } 
        // If only email is provided, search by email
        else if (email) {
            leads = await LeadsModel.find({ email: new RegExp(email, 'i') });
        } 
        // If neither name nor email is provided, return an error
        else {
            return res.status(400).send({
                success: false,
                message: "Please provide a name or email for search"
            });
        }

        // Return the found leads
        return res.status(200).send({
            success: true,
            message: "Leads fetched successfully",
            leads
        });
    } catch (error) {
        // If there is an error in the API, return an error message
        return res.status(500).send({
            success: false,
            message: "Error in searchLeads API",
            error
        })
    }
}
