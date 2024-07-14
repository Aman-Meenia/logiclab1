import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React from "react";

interface CodeEditorProps {
  lang: {
    name: string;
    language: string;
    value: string;
    key: string;
  };
  editorRef: any;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ lang, editorRef }) => {
  const { theme } = useTheme();
  return (
    <Editor
      height="100%"
      theme={theme === "light" ? "light" : "vs-dark"}
      path={lang.name}
      defaultLanguage={lang.name}
      defaultValue={lang.value}
      onMount={(editor) => (editorRef.current = editor)}
    />
  );
};

export default CodeEditor;
