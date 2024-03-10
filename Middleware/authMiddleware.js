import JWT from "jsonwebtoken";
import InstructorModel from "../models/InstructorModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRETKEY
    );
    req.user = decode;
    next();
  } catch (error) {
    res.status(401).send({
      success: false,
      message: "User Should be Signed in",
      error,
    });
  }
};

export const isInstructor = async (req, res, next) => {
  try {
    const user = await InstructorModel.findById(req.user._id);

    if (user.Role != "Instructor") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Acess Register as Teacher First",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in Teacher middelware",
    });
  }
};
