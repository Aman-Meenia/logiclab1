import mongoose, { Document } from "mongoose";

export interface SubmissionType extends Document {
  problemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  language: string;
  code: string;
  status: string;
  time: string;
  memory: string;
}

const submissionSchema: mongoose.Schema<SubmissionType> = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    memory: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Submission =
  mongoose.models.Submission ||
  mongoose.model<SubmissionType>("Submission", submissionSchema);

export default Submission;
