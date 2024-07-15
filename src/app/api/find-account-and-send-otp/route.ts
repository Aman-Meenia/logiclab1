import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmails } from "@/resend/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { identifier } = await request.json();
    const existingUser = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });
    if (!existingUser) {
      return Response.json(
        {
          success: false,
          message: "User Account not found",
        },
        { status: 404 }
      );
    }

    const Otp = Math.floor(100000 + Math.random() * 900000).toString();
    const OtpExpiry = new Date();
    OtpExpiry.setHours(OtpExpiry.getHours() + 1);
    existingUser.Otp = Otp;
    existingUser.OtpExpiry = OtpExpiry;
    existingUser.forgotPassword = false;
    const emailResponse = await sendVerificationEmails(
      existingUser.username,
      existingUser.email,
      Otp
    );
    console.log(emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    await existingUser.save();
    return Response.json(
      {
        success: true,
        message: "OTP sent successfully",
        data: existingUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error finding the account: ", error);
    return Response.json(
      { success: false, message: "Error finding the account" },
      { status: 500 }
    );
  }
}
