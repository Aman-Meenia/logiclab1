import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import redis from "@/db/redisConnect";
const pollingRequestTypeValidation = z
  .object({
    uniqueId: z.string().min(1, "uniqueId is required"),
  })
  .strict();

type pollingRequestType = z.infer<typeof pollingRequestTypeValidation>;

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: pollingRequestType = await request.json();

    // console.log(body);

    // check for the status of the problem in redis

    const problemData = await redis.get(body.uniqueId + "_status");
    console.log(problemData);

    if (!problemData) {
      const errorResponse: responseType = {
        message: "Invalid uniqueId",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const parseProblemData = JSON.parse(problemData);

    // if the cnt is not 0 it mean than the problem is not solved yet

    if (parseProblemData.cnt > 0) {
      const successResponse: responseType = {
        message: "Successfully polled the problem",
        success: "true",
        status: 200,
        messages: [
          {
            status: "Pending",
            error: false,
            errorMessage: "",
          },
        ],
      };
      return NextResponse.json(successResponse);
    }

    // if the cnt is 0 and the error is true then return error
    if (parseProblemData.error) {
      const errorResponse: responseType = {
        message: "Error in the problem",
        success: "true",
        status: 200,
        messages: [
          {
            status: "Error",
            error: true,
            errorMessage: parseProblemData.errorMessage,
          },
        ],
      };
      return NextResponse.json(errorResponse);
    }
    // if cnt is 0 than return the success of the problem

    if (parseProblemData.cnt === 0) {
      const successResponse: responseType = {
        message: "Successfully polled the problem",
        success: "true",
        status: 200,
        messages: [
          {
            status: "Accepted",
            error: false,
            errorMessage: "",
          },
        ],
      };
      return NextResponse.json(successResponse);
    }
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error ",
      success: "false",
      status: 400,
    };
    return NextResponse.json(errorResponse);
  }
}
