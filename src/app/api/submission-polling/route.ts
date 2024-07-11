import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/problemType";
import redis from "@/db/redisConnect";
import { ObjectId } from "mongodb";
import { diffLang } from "../../../../boilerPlateGenerator/LanguageCode";
import { Submission } from "@/models/submissionModel";
const pollingRequestTypeValidation = z
  .object({
    uniqueId: z.string().min(1, "uniqueId is required"),
  })
  .strict();

type pollingRequestType = z.infer<typeof pollingRequestTypeValidation>;

const submissionTypeValidation = z
  .object({
    problemId: z.instanceof(ObjectId, {
      message: "problemId must be mongodb instance",
    }),
    userId: z.instanceof(ObjectId, {
      message: "userId must be mongodb instance",
    }),
    code: z.string().trim().min(1, "code is required"),
    language: z.enum(diffLang),
    languageId: z.string(),
    problemTitle: z.string(),
    status: z.string(),
    time: z.string(),
    memory: z.string(),
  })
  .strict();

type submissionType = z.infer<typeof submissionTypeValidation>;

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: pollingRequestType = await request.json();

    // console.log(body);

    // check for the status of the problem in redis

    const problemData = await redis.get(body.uniqueId + "_status");
    // console.log(problemData);

    if (!problemData) {
      const errorResponse: responseType = {
        message: "Invalid uniqueId",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const parseProblemData = JSON.parse(problemData);
    //TODO: if the error in problem or the all the testcase are evaluated store the submission in database
    console.log(parseProblemData);
    // if the cnt is not 0 it mean than the problem is not solved yet

    if (parseProblemData.cnt === 1) {
      const successResponse: responseType = {
        message: "Successfully polled the problem",
        success: "true",
        status: 200,
        messages: [
          {
            status: "Pending",
          },
        ],
      };
      return NextResponse.json(successResponse);
    }

    // if the cnt is 0 and the error is true then return error
    // if (parseProblemData.error) {
    //   const errorResponse: responseType = {
    //     message: "Error in the problem",
    //     success: "true",
    //     status: 200,
    //     messages: [
    //       {
    //         status: "Accepted", //Accepted not mean that testcase are accepted
    //         error: true,
    //         errorMessage: parseProblemData.errorMessage,
    //         time: parseProblemData.time,
    //         memory: parseProblemData.memory,
    //       },
    //     ],
    //   };
    //   return NextResponse.json(errorResponse);
    // }
    // if cnt is 0 than return the success of the problem

    // if (parseProblemData.cnt === 0) {
    const successResponse: responseType = {
      message: "Successfully polled the problem",
      success: "true",
      status: 200,
      messages: [
        {
          status: parseProblemData.status,
          error: parseProblemData.error,
          errorMessage: "",
          time: parseProblemData.time,
          memory: parseProblemData.memory,
          stdout: parseProblemData.stdout,
          testCaseResult: parseProblemData.testCaseResult,
          compile_output: parseProblemData.compile_output,
        },
      ],
    };
    return NextResponse.json(successResponse);
    // }
  } catch (err) {
    const errorResponse: responseType = {
      message: "Internal server error ",
      success: "false",
      status: 400,
    };
    return NextResponse.json(errorResponse);
  }
}
