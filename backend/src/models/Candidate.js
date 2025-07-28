import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: String,
    emailAddress: String,
    phoneNumber: String,
    position: String,
    experience: String, 
    resume: String,
    status: {
      type: String,
      default: "New",
      enum: ["New", "Selected", "Rejected"],
    },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
