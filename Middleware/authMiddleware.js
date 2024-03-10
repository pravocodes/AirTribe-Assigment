// Import necessary modules and dependencies
import JWT from "jsonwebtoken";
import InstructorModel from "../models/InstructorModel.js";

// Middleware function to check if user is signed in
export const requireSignIn = async (req, res, next) => {
  try {
    // Verify JWT token from request headers using the secret key
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRETKEY
    );

    // Set decoded user information to request object
    req.user = decode;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Return error response if token verification fails
    res.status(401).send({
      success: false,
      message: "User should be signed in",
      error,
    });
  }
};

// Middleware function to check if user is an instructor
export const isInstructor = async (req, res, next) => {
  try {
    // Find the user in the InstructorModel by ID
    const user = await InstructorModel.findById(req.user._id);

    // Check if user is not an instructor
    if (user.Role != "Instructor") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access. Register as a teacher first.",
      });
    } else {
      // Proceed to the next middleware or route handler if user is an instructor
      next();
    }
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in teacher middleware",
    });
  }
};
