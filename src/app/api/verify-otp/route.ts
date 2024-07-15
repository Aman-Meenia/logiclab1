import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, otp } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const isOtpValid = user.Otp === otp;
    const isOtpExpired = Date.now() > user.OtpExpiry.getTime();
    if (isOtpValid && !isOtpExpired) {
      user.isVerified = true;
      if (!user.forgotPassword) {
        user.forgotPassword = true;
      }
      await user.save();
      return Response.json(
        { success: true, message: "User verified successfully" },
        { status: 200 }
      );
    } else if (isOtpExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Validity of the Otp has expired. Please sign up again to verify your account",
        },
        { status: 400 }
      );
    } else if (!isOtpValid) {
      return Response.json(
        { success: false, message: "Invalid otp" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Error verifying the otp" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error verifying the otp ", error);
    return Response.json(
      { success: false, message: "Error verifying the otp" },
      { status: 500 }
    );
  }
}
