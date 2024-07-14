import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import Problem from "@/models/problemModel";
import dbConnect from "@/db/dbConnect";

const problemTitleSchema = z.object({
  problemTitle: z.string().min(1, { message: "Problem title is required" }),
});
// api to check if the problem is present or not
export async function GET(request: NextRequest, context: any) {
  try {
    const { searchParams } = new URL(request.url);
    dbConnect();
    const { params } = context;
    const { title } = params;
    const problemTitle = title;
    const zodResponse = problemTitleSchema.safeParse({ problemTitle });

    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const problem = await Problem.findOne({
      problemTitle: problemTitle,
      type: "regularProblem",
    })
      .select("_id problemTitle difficulty description problemName")
      .populate({
        path: "defaultCode",
        select: "-_id cppCode jsCode tsCode",
      })
      .populate({
        path: "defaultTestCase",
        select: "-_id testCase1 testCase2 testCase3",
      });

    if (!problem) {
      const errorResponse: responseType = {
        message: "Problem not found",
        success: "false",
        status: 404,
      };
      return NextResponse.json(errorResponse);
    }

    const successResponse: responseType = {
      message: "Problem found",
      messages: [{ problem: problem }],
      success: "true",
      status: 200,
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error",
      messages: [{ err: err }],
      success: "false",
      status: 400,
    };
    return NextResponse.json(errorResponse);
  }
}
