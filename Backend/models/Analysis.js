import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    targetRole: { type: String, default: "" },
    resumeText: { type: String, required: true },
    result: {
      summary: String,
      atsScore: Number,
      skills: [String],
      strengths: [String],
      weaknesses: [String],
      skillGaps: [String],
      interviewQuestions: [
        {
          question: String,
          category: String,
          difficulty: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Analysis", analysisSchema);
