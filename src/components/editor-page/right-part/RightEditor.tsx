"use client";
import React, { useEffect, useRef, useState } from "react";
import RightEditorHeader from "./RightEditorHeader";
import CodeEditor from "./CodeEditor";
import langs from "@/../constants/defaultLangs";

const RightEditor = () => {
  const editorRef = useRef<HTMLInputElement | null>(null);
  const [langName, setLangName] = useState<keyof typeof langs>("js");

  const lang = langs[langName as string];

  useEffect(() => {
    editorRef.current?.focus();
  }, [lang.name]);
  return (
    <div className="bg-[#333333] h-2/3 rounded-sm flex flex-col">
      <RightEditorHeader langName={langName} setLangName={setLangName} />
      <CodeEditor lang={lang} editorRef={editorRef} />
    </div>
  );
};

export default RightEditor;
