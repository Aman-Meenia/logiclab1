import langs from "@/../constants/defaultLangs";
import React from "react";

interface RightEditorHeaderProps {
  langName: keyof typeof langs;
  setLangName: (langName: string) => void;
}

const RightEditorHeader: React.FC<RightEditorHeaderProps> = ({
  langName,
  setLangName,
}) => {
  return (
    <div className="text-white p-2">
      Code Editor
      <select
        onChange={(e) => setLangName(e.target.value)}
        value={langName}
        className="ml-2 bg-white text-black cursor-pointer py-0.5 rounded-sm hover:bg-slate-100"
      >
        {Object.values(langs).map((lang, index) => (
          <option key={index} value={lang.key}>
            {lang.language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default RightEditorHeader;
