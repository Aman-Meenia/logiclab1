import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, password } = await request.json();
    const existingUser = await UserModel.findOne({
      username,
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
    if (!existingUser.forgotPassword) {
      return Response.json(
        {
          success: false,
          message:
            "Please verify the otp before proceeding to reset the password",
        },
        { status: 500 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    existingUser.forgotPassword = false;
    existingUser.password = hashedPassword;
    existingUser.updatedAt = new Date();

    await existingUser.save();
    return Response.json(
      {
        success: true,
        message: "Password Reset Successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting the password: ", error);
    return Response.json(
      { success: false, message: "Error resetting the password." },
      { status: 500 }
    );
  }
}
