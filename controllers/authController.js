// Import necessary modules and dependencies
import { comparePassword, hashedPassword } from "../helper/authHelper.js";
import InstructorModel from "../models/InstructorModel.js";
import StudentModel from "../models/StudentModel.js";
import Jwt from "jsonwebtoken";

// Controller function to handle user registration
export const RegisterController = async (req, res) => {
  try {
    // Destructure request body to extract user data
    const { Name, PhoneNumber, Role, Email, Password, linkedinProfile } =
      req.body;

    // Check for required fields and return error message if missing
    if (!Name || !PhoneNumber || !Role || !Email || !Password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if user already exists in either Instructor or Student collection
    const InstructorExist = await InstructorModel.findOne({ Email });
    const StudentExist = await StudentModel.findOne({ Email });
    if (InstructorExist || StudentExist) {
      return res.status(409).send({
        success: false,
        message: "User Already Exists",
      });
    }

    // Hash user password
    const hashPassword = await hashedPassword(Password);
    let user;

    // Create new user based on role (Instructor or Student)
    if (Role === "Student") {
      user = await new StudentModel({
        Name,
        PhoneNumber,
        Role,
        Email,
        linkedinProfile,
        Password: hashPassword,
      }).save();
    } else if (Role === "Instructor") {
      user = await new InstructorModel({
        Name,
        PhoneNumber,
        Role,
        Email,
        Password: hashPassword,
      }).save();
    } else {
      return res.status(400).send({
        message: "Invalid Role. Choose Instructor or Student",
      });
    }

    // Return success message along with user details
    return res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// Controller function to handle user login
export const LoginController = async (req, res) => {
  try {
    // Destructure request body to extract email and password
    const { Email, Password } = req.body;

    // Check if email and password are provided
    if (!Email || !Password) {
      return res.status(400).send({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find user in either Instructor or Student collection
    const Instructor = await InstructorModel.findOne({ Email });
    const Student = await StudentModel.findOne({ Email });

    // If user not found, return error message
    if (!Instructor && !Student) {
      return res.status(404).send({
        success: false,
        message: "User with this email is not registered",
      });
    }

    // Determine user type and set 'user' variable accordingly
    let user = Instructor ? Instructor : Student;

    // Compare provided password with hashed password stored in database
    const match = await comparePassword(Password, user.Password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT token for authentication
    const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });

    // Return success message along with user details and token
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.Name,
        phone: user.PhoneNumber,
        role: user.Role,
        email: user.Email,
      },
      token,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
