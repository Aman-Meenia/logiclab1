import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmails } from "@/resend/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken." },
        { status: 400 }
      );
    }

    const existingVerifiedUserByEmail = await UserModel.findOne({
      email,
    });

    const Otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingVerifiedUserByEmail) {
      if (existingVerifiedUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User with this email already exists." },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);
        await UserModel.findOneAndUpdate(
          {
            email,
            isVerified: false,
          },
          {
            username,
            password: hashedPassword,
            Otp,
            OtpExpiry: expiryDate,
          }
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        Otp,
        OtpExpiry: expiryDate,
        image:
          "https://static.vecteezy.com/system/resources/thumbnails/027/708/418/small/default-avatar-profile-icon-in-flat-style-free-vector.jpg",
        isVerified: false,
        createdAt: new Date(),
        contestSubmissions: [],
        role: "USER",
        submissions: [],
        contestPoints: [],
      });

      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmails(username, email, Otp);
    console.log(emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. PLease verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.error("Error registering user: ", err);
    return Response.json(
      { success: false, message: "Error registering user." },
      { status: 500 }
    );
  }
}
