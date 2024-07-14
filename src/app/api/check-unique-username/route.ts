import dbConnect from "@/db/dbConnect";
import UserModel from "@/models/User";
import { usernameValidation } from "@/validation-schemas/validationSchema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const usernameQuery = searchParams.get("username");
    const result = usernameValidation.safeParse(usernameQuery);
    if (!result.success) {
      const usernameQueryErrors = result.error.format()?._errors || [
        "Invalid username",
      ];
      return Response.json(
        { success: false, message: usernameQueryErrors.join(", ") },
        { status: 400 }
      );
    }

    const username = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      { success: true, message: "Username is available" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking the username: ", error);
    return Response.json(
      { success: false, message: "Error checking the username" },
      { status: 500 }
    );
  }
}
