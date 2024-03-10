import { comparePassword, hashedPassword } from "../helper/authHelper.js";
import InstructorModel from "../models/InstructorModel.js";
import StudentModel from "../models/StudentModel.js";
import Jwt from "jsonwebtoken";

export const RegisterController = async (req, res) => {
  try {
    const { Name, PhoneNumber, Role, Email, Password } = req.body;

    if (!Name) {
      return res.send({ message: "Name is Required" });
    }
    if (!PhoneNumber) {
      return res.send({ message: "PhoneNumber is Required" });
    }
    if (!Role) {
      return res.send({ message: "Role is required" });
    }
    if (!Email) {
      return res.send({ message: "Email is Required" });
    }
    if (!Password) {
      return res.send({ message: "Password is Required" });
    }
    // console.log("data fetched")

    const InstructorExist = await InstructorModel.findOne({ Email });
    const StudentExist = await StudentModel.findOne({ Email });
    if (InstructorExist || StudentExist) {
      return res.status(201).send({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashPassword = await hashedPassword(Password);
    let user;
    if (Role === "Student") {
      user = await new StudentModel({
        Name,
        PhoneNumber,
        Role,
        Email,
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
      return res.status(403).send({
        message: "Choose Instructor or Student",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }
    const Instructor = await InstructorModel.findOne({ Email });
    const Student = await StudentModel.findOne({ Email });
    if (!Instructor && !Student) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    let user = Instructor ? Instructor : Student;
    const match = await comparePassword(Password, user.Password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = await Jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
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
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
