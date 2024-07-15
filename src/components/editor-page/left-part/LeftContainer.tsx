import React from "react";
import LeftHeader from "./LeftHeader";
import LeftContent from "./LeftContent";

const LeftContainer = () => {
  return (
    <div className="bg-[#0F0F0F] w-1/2 rounded-t-sm flex flex-col p-1">
      <LeftHeader />
      <LeftContent />
    </div>
  );
};

export default LeftContainer;
