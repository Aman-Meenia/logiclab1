"use client";
import React, { useState } from "react";
import RightInput from "./RightInput";
import RightOutput from "./RightOutput";

const RightInputOutput = () => {
  const [input, setInput] = useState<Boolean>(true);
  return (
    <div className="bg-[#333333] h-1/3 rounded-sm flex flex-col text-white">
      <div className="flex gap-4 p-2">
        <div
          className={`${
            input
              ? "cursor-default border-b-2 border-[#28C244]"
              : "cursor-pointer"
          } p-1`}
          onClick={() => {
            if (!input) {
              setInput(true);
            }
          }}
        >
          Test Cases
        </div>
        <div
          className={`${
            !input
              ? "cursor-default border-b-2 border-[#28C244]"
              : "cursor-pointer"
          } p-1`}
          onClick={() => {
            if (input) {
              setInput(false);
            }
          }}
        >
          Test Results
        </div>
      </div>
      <div className="bg-[#262626] h-full p-1 rounded-sm mx-0.5 mb-0.5">
        {input ? <RightInput /> : <RightOutput />}
      </div>
    </div>
  );
};

export default RightInputOutput;
