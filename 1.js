// const str = "NDEK\n";
// // "MjEK";
// // "bWFpbi5jOjE6OTogZmF0YWwgZXJyb3I6IGlvc3RyZWFtOiBObyBzdWNoIGZp\nbGUgb3IgZGlyZWN0b3J5CiAgICAxIHwgI2luY2x1ZGU8aW9zdHJlYW0+CiAg\nICAgIHwgICAgICAgICBefn5+fn5+fn5+CmNvbXBpbGF0aW9uIHRlcm1pbmF0\nZWQuCg==\n";
// const ans = Buffer.from(str, "base64").toString("utf-8");
// console.log(ans);

// console.log("type of " + typeof reksult);
// const parseResult = JSON.parse(result);
// console.log("parse result is " + parseResult);
// const newStatus = await redis
//
//   .multi()
//   .get(status_id)
// .exec((err, result) => {
//   if (err) {
//     console.log(err);
//     return err;
//   }
//
//   if (!result || result === null) {
//     const errorResponse: responseType = {
//       message: "Response not found",
//       success: "false",
//       status: 400,
//     };
//
//     return NextResponse.json(errorResponse);
//   }
//
//   const parseResult = result[0];
//   // const responseis = JSON.parse(result);
//   console.log("Result is " + parseResult);
//
//   console.log("type is " + typeof parseResult);

// const cntis = parseResult.cnt;
// console.log("cnt is " + cntis);
// result?.cnt -= 1;
// result?.outputs[cnt] = true;

// const parseResult = JSON.parse(result);
// console.log("ParseResult " + parseResult);

//   return result;
// });

// if (!newStatus) {
//   const errorResponse: responseType = {
//     message: "Response not found",
//     success: "false",
//     status: 400,
//   };
//   return NextResponse.json(errorResponse);
// }
// console.log("preData " + newStatus);
// const parseNewStatus = JSON.parse(newStatus);
// console.log("Cnt is " + parseNewStatus.cnt);
// parseNewStatus.cnt -= 1;
// parseNewStatus.outputs[cnt] = true;
//
// const newStatusString = JSON.stringify(parseNewStatus);
// console.log("new status " + newStatusString);
// await redis.set(status_id, newStatusString, "EX", timeOut);
