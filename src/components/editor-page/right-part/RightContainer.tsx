import React from "react";
import RightEditor from "./RightEditor";
import RightInputOutput from "./RightInputOutput";

const RightContainer = () => {
  return (
    <div className="bg-[#0F0F0F] w-1/2 rounded-sm flex flex-col gap-3 p-1">
      <RightEditor />
      <RightInputOutput />
    </div>
  );
};

export default RightContainer;
