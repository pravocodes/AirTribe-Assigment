import mongoose from "mongoose";

const CourseModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    maxSeats: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    acceptedLeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    rejectedLeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    waitingLeads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", CourseModel);
