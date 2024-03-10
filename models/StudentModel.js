import mongoose from "mongoose";

const StudentModel = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    PhoneNumber: {
      type: String,
      unique: true,
      required: true,
    },
    Role: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    linkedinProfile: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", StudentModel);
