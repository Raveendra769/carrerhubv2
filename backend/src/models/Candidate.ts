import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // 🔥 prevents duplicate emails
    lowercase: true,
    trim: true
  },
  position: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    enum: ["Applied", "Interview", "Offer"],
    default: "Applied"
  }
});

export default mongoose.model("Candidate", candidateSchema);