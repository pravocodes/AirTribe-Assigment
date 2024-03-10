import CommentModel from "../models/CommentModel.js";

export const addCommentController = async (req, res) => {
  try {
    // Parse request body
    const courseId = req.params.id;
    const { text } = req.body;

    // Validate input data
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

    return res
      .status(200)
      .send({ success: true, message: "Comment added successfully.", comment });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ success: false, message: "Error adding comment.", error });
  }
};
