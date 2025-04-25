import { useLocation } from "react-router-dom";
import CodeEditor from "./CodeEditor";

const CodeEditorTerminal = () => {
  const location = useLocation();
  const { code, language } = location.state || { code:"", language: "C++" };

  return <CodeEditor code={code} language={language} />;
};

export default CodeEditorTerminal;