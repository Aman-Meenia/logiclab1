import LeftContainer from "@/components/editor-page/left-part/LeftContainer";
import RightContainer from "@/components/editor-page/right-part/RightContainer";
import React from "react";

const EditorPage = () => {
  return (
    <div className="flex bg-[#0F0F0F] min-h-[calc(100vh-60px)] gap-2 p-3">
      <LeftContainer />
      <RightContainer />
    </div>
  );
};

export default EditorPage;
