import mongoose, { Schema, Document } from "mongoose";

// Define the User schema
const userSchema = new Schema<UserDocument>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please enter a valid email addresss.",
    ],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  token: { type: String },
  Otp: { type: String, required: [true, "Otp is required"] },
  OtpExpiry: {
    type: Date,
    required: [true, "Otp Expiry Date is required"],
  },
  isVerified: {
    type: Boolean,
    required: [true, "isVerified is required"],
    default: false,
  },
  password: { type: String, required: [true, "Password is required"] },
  forgotPassword: { type: Boolean, default: false },
  image: { type: String },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date },
  contestSubmissions: [
    { type: Schema.Types.ObjectId, ref: "ContestSubmission" },
  ],
  role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  submissions: [{ type: Schema.Types.ObjectId, ref: "Submission" }],
  contestPoints: [{ type: Schema.Types.ObjectId, ref: "ContestPoints" }],
});

// Create the User model
export interface UserDocument extends Document {
  email: string;
  username: string;
  token?: string;
  Otp: string;
  OtpExpiry: Date;
  isVerified: boolean;
  forgotPassword?: boolean;
  password: string;
  image: string;
  createdAt: Date;
  updatedAt?: Date;
  contestSubmissions: Schema.Types.ObjectId[];
  role: "USER" | "ADMIN";
  submissions: Schema.Types.ObjectId[];
  contestPoints: Schema.Types.ObjectId[];
}

const UserModel =
  (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
