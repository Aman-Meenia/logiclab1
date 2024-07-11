import dbConnect from "@/db/dbConnect";
import { responseType } from "@/types/problemType";
import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { boolean, z } from "zod";
import { fromZodError } from "zod-validation-error";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import {
  diffLang,
  languageCode,
} from "../../../../boilerPlateGenerator/LanguageCode";
import { v4 as uuidv4 } from "uuid";
import redis from "@/db/redisConnect";

const timeOut = 5 * 60;

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
    problemTitle: z.string(),
  })
  .strict();
type submissionRequestType = z.infer<typeof submissionTypeValidation>;

export async function POST(request: NextRequest) {
  try {
    //TODO: Firstly check if the user is login on not by checking the session

    dbConnect();
    const body: submissionRequestType = await request.json();
    try {
      body.problemId = new ObjectId(body.problemId);
      body.userId = new ObjectId(body.userId);
    } catch (e) {
      const errorResponse: responseType = {
        message: "problemId and userId must be mongodb instance",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const zodResponse = submissionTypeValidation.safeParse(body);

    if (zodResponse.success === false) {
      console.log(fromZodError(zodResponse?.error).message);
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // Firsly read all the inputs and outputs file of selected problem

    const inputFile = readInputFiles(body.problemTitle);
    const outputFile = readOutputFiles(body.problemTitle);
    // console.log("<------------Input And Output  File Start ------------>");
    // console.log(inputFile, outputFile);
    // console.log("<------------Input And Output File End ------------>");

    if (inputFile.success === false || outputFile.success === false) {
      const errorResponse: responseType = {
        message: "File not found only when the title is wrong ",
        // message:
        //   inputFile.success === false
        //     ? inputFile.errMessage
        //     : outputFile.errMessage,
        status: 500,
        success: "false",
      };
      return NextResponse.json(errorResponse);
    }

    // Read the full boiler plate of the selected language and replace the // Add user function here with the user given code
    const fullCode = readFullBoilerPlate(
      body.problemTitle,
      body.language,
      body.code,
    );
    // console.log("<-------------FULL CODE START ------------------->");
    // console.log(fullCode.code);
    // console.log("<-------------FULL CODE END ------------------->");

    if (fullCode.success === false) {
      const errorResponse: responseType = {
        message: fullCode.code,
        status: 500,
        success: "false",
      };
      return NextResponse.json(errorResponse);
    }

    // Make the judge0 call
    const language_id = languageCode.get(body.language);
    const inputs = inputFile.response;
    const outputs = outputFile.response;
    // console.log("callback is " + process.env.CALLBACK_URI);

    // generate uniqueId
    const uniqueId = uuidv4();
    console.log(uniqueId);

    // create uuid_status in readis to store the status of the code

    const testcaseSize = inputs.length;
    const uuid_status = {
      cnt: 1,
      outputs: Array.from({ length: testcaseSize }, () => false),
      error: boolean,
      errorMessage: String,
    };

    await redis.set(
      uniqueId + "_status",
      JSON.stringify(uuid_status),
      `EX`,
      timeOut,
    );

    // also store the user code in the redis (because i am not storing the submissions in mongodb intitally store only when the judge0 give ouput for all testcase)

    await redis.set(uniqueId + "_code", body.code, `EX`, timeOut);

    // send the code to judge0 for all the inputs
    //TODO: Only one testcase is working at a time for now
    for (let i = 0; i < 1; i++) {
      const response = await axios.post(
        `${process.env.JUDGE_URI}/submissions`,
        {
          source_code: fullCode.code,
          language_id: language_id,
          stdin: inputs[i],
          expected_output: outputs[i],
          callback_url: process.env.CALLBACK_URI,
        },
      );
      // console.log(response.data.token);
      // save the toke to the redis with the uuid and the cnt of testcase
      const token = response.data.token;
      await redis.set(
        token,
        JSON.stringify({
          uuid: uniqueId,
          index: i,
        }),
        `EX`,
        timeOut,
      );
    }

    const successResponse: responseType = {
      message: "Successfully submitted the code",
      messages: [
        {
          uniqueId: uniqueId,
        },
      ],
      status: 200,
      success: "true",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log(err);
    const errorResponse: responseType = {
      message: "Internal server error ",
      status: 500,
      success: "false",
    };
    return NextResponse.json(errorResponse);
  }
}

type responseMsg = {
  success: false | true;
  response: string[];
  errMessage: string;
};
const filepath = path.resolve(process.cwd(), "problems");

const readInputFiles = (title: string): responseMsg => {
  const problempath = path.join(filepath, title, "input");
  // console.log("FIle path " + filepath);
  // console.log("path is " + problempath);
  // console.log(`Current Working Directory: ${process.cwd()}`);
  if (!fs.existsSync(problempath)) {
    console.log("File not found");
    return {
      success: false,
      errMessage: "File not found",
      response: [],
    };
  }
  // console.log("Input working ");
  const input: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const inputFilePath = path.join(problempath, `${i}.txt`);
    if (!fs.existsSync(inputFilePath)) {
      break;
    }
    const data = fs.readFileSync(inputFilePath, "utf-8");
    input.push(data);
  }

  return {
    success: true,
    response: input,
    errMessage: "No error",
  };
};

const readOutputFiles = (title: string): responseMsg => {
  const problempath = path.join(filepath, title, "output");

  if (!fs.existsSync(problempath)) {
    // console.log("File not found");
    return {
      success: false,
      errMessage: "File not found",
      response: [],
    };
  }

  const output: string[] = [];

  for (let i = 1; i <= 10; i++) {
    const outputFilePath = path.join(problempath, `${i}.txt`);

    if (!fs.existsSync(outputFilePath)) {
      break;
    }
    const data = fs.readFileSync(outputFilePath, "utf-8");
    output.push(data);
    // console.log(data);
  }
  // console.log(output);

  return {
    success: true,
    response: output,
    errMessage: "No error",
  };
};
// readOutputFile("Room-Allocation");

// Read the full boilerPlate of the selected languange and replace the function with user given code

type boilerPlateResponse = {
  success: false | true;
  code: string;
};
const readFullBoilerPlate = (
  title: string,
  lang: string,
  userCode: string,
): boilerPlateResponse => {
  const problempath = path.join(filepath, title, "boilerplateFullDir");

  if (!fs.existsSync(problempath)) {
    // console.log("File not found");
    return {
      success: false,
      code: "File not found",
    };
  }

  const boilerPlateFilePath = path.join(
    problempath,
    `boilerplate-full-${lang}.txt`,
  );
  if (!fs.existsSync(boilerPlateFilePath)) {
    // console.log("File not found");
    return {
      success: false,
      code: "File not found",
    };
  }

  let code = fs.readFileSync(boilerPlateFilePath, "utf-8");
  code = code.replace("// Add user function here", userCode);

  // console.log(code);
  return {
    success: true,
    code: code,
  };
};
