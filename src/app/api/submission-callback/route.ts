import { responseType } from "@/types/problemType";
import { NextRequest, NextResponse } from "next/server";
import redis from "@/db/redisConnect";
const timeOut = 5 * 60;

//  status: { id: 4, description: 'Wrong Answer' }
//  status: {id:3 , description: 'Accepted'}
//   status: { id: 6, description: 'Compilation Error' }

const convertBase64ToUtf8 = (str: string): string => {
  const ans = Buffer.from(str, "base64").toString("utf-8");
  return ans;
};

export async function PUT(request: NextRequest) {
  try {
    // console.log("--------------------------Start---------------------------");

    // console.log("Judge 0 callback called");
    const response = await request.json();
    console.log(response);
    const token = response.token;

    const compileOutput = response.compile_output;

    // console.log("COmpile output ", convertBase64ToUtf8(compileOutput));
    let convertedComplieOutput = "";
    if (compileOutput) {
      convertedComplieOutput = convertBase64ToUtf8(compileOutput);
    }

    if (!token) {
      const errorResponse: responseType = {
        message: "Token not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    // get the testCase number ( index) and its uuid

    const TestcaseNumber = await redis.get(token);

    if (!TestcaseNumber) {
      console.log("Testcase not found");
      const errorResponse: responseType = {
        message: "Response not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const { index, uuid } = JSON.parse(TestcaseNumber);
    const status_id = uuid + "_status";

    // if wrong answer or the accpeted answer we need to check for all other testcase else we do not check
    // otherTestcase and make the cnt = 0 and give the output to the user

    let acceptedStatus = false;

    if (
      response.status.id === 4 &&
      response.status.description === "Wrong Answer"
    ) {
      console.log("Wrong answer ");
    } else if (
      response.status.id === 3 &&
      response.status.description === "Accepted"
    ) {
      acceptedStatus = true;
      console.log("Accepted");
    } else {
      // If not accepted and not wrong answer it mean their is an error in the code

      // set the cnt to 0 and error=true ,  errorMessage=compliationstatus
      const uuid_status = await redis.get(status_id);

      if (uuid_status === null) {
        const errorResponse: responseType = {
          message: "Response not found",
          success: "false",
          status: 400,
        };
        return NextResponse.json(errorResponse);
      }

      const parseResult = JSON.parse(uuid_status);
      parseResult.cnt = 0;
      parseResult.error = true;
      parseResult.errorMessage = convertBase64ToUtf8(compileOutput);
      await redis.set(status_id, JSON.stringify(parseResult));

      // Also add the submission in the db
    }

    //BUG: When the multiple callback are called from the judge0 than the value which we get the
    //previouse value and sometime it works fine even when we user the multi set and get (transaction)
    const multi = redis.multi();
    multi.get(status_id);

    const responseData = await multi.exec();
    const result = responseData?.[0]?.[1];
    console.log("Pre data is " + result);

    if (typeof result != "string") {
      const errorResponse: responseType = {
        message: "Response not found",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    const parseResult = JSON.parse(result);

    if (parseResult.cnt === 0) {
      const errorResponse: responseType = {
        message: "All testcases are solved or the error occured in code",
        success: "false",
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }
    parseResult.cnt -= 1;
    parseResult.outputs[index] = true;

    // if cnt becomes zero update the status of the problem to true because now we can give output to the frontend

    // console.log("PARSE RESULT " + parseResult);
    multi.set(status_id, JSON.stringify(parseResult));
    await multi.exec();
    const newDataIs = await redis.get(status_id);
    console.log(newDataIs);

    const successResponse: responseType = {
      message: "Testcase updated successfully",
      success: "true",
      status: 200,
    };

    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in submission callback  route ", err);
    const errorResponse: responseType = {
      message: "Internal server eroor",
      success: "false",
      status: 500,
    };

    return NextResponse.json(errorResponse);
  }
}
