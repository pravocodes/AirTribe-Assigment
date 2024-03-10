// Import necessary modules and dependencies
import CommentModel from "../models/CommentModel.js";

// Controller function to handle adding comments to a course
export const addCommentController = async (req, res) => {
  try {
    // Parse request body to extract course ID and comment text
    const courseId = req.params.id;
    const { text } = req.body;

    // Validate input data: course ID and comment text are required
    if (!courseId || !text) {
      return res
        .status(400)
        .send({ message: "Course ID and comment text are required." });
    }

    // Create comment in the database
    const comment = await CommentModel.create({
      courseId,
      userId: req.user._id,
      text,
    });

    // Return success message along with the added comment
    return res
      .status(201)
      .send({ success: true, message: "Comment added successfully.", comment });
  } catch (error) {
    // Handle errors
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error adding comment.", error });
  }
};
