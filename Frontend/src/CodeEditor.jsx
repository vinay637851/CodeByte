import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";

import "codemirror/addon/edit/closebrackets.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/python/python.js";
import "./App.css";
import CodeMirror from "codemirror";

import Button from "@mui/material/Button";

import {Link} from "react-router-dom"
import { Play, Maximize, Minimize,LogOut } from "lucide-react";
import { useState } from "react";
import Theme from "./Theme";
import Language from "./Language";

function Codebox({code,language}) {
  let [Lang, SetLang] = useState(language);
  let [editorExist, SeteditorExist] = useState(true);
  let [editor, Seteditor] = useState(null);
  let [isFullScreen, SetisFullScreen] = useState(false);
  const HandelEditor = () => {
    if (editorExist) {
      editor = CodeMirror.fromTextArea(document.getElementById("codebox"), {
        mode: "text/x-c++src",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true,
      });
      editor.setSize("100%", "100%");
      if(code==""){
      editor.setValue(
        `//This is a C++ program\n#include <iostream>  // Include the input/output stream library \nusing namespace std;\n\nint main() { \n  cout << "Hello, C++!" << endl;  // Output "Hello, C++!" to the console \n  return 0;  // Return 0 to indicate the program ended successfully \n}`
      );
      }
      else{
        editor.setValue(code);
      } 
      if(language=="Java")
        editor.setOption("mode", "text/x-java");
      else if(language=="Python")
        editor.setOption("mode", "text/x-python");
      else if(language=="C++")
        editor.setOption("mode", "text/x-c++src");
      editorExist = false;
      SeteditorExist(false);
      Seteditor(editor);
    }
  };
  async function SendMsg() {
    const res = await fetch("https://codebyte-51m1.onrender.com/code/workplace/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: editor.getValue(),
        input: document.getElementById("Input").value,
        language: Lang,
      }),
    });
    const data = await res.json();
    document.getElementById("Output").innerHTML =
      data.output == undefined ? data.error : data.output;
  }
  function ExpandScreen() {
    document.getElementById("Codebox_Screen").classList.toggle("flex-col");
    document.getElementById("Codebox_editor").classList.toggle("w-screen");
    document.getElementById("Codebox_I/O").classList.toggle("w-screen");
    SetisFullScreen(!isFullScreen);
  }
  return (
    <div className="h-screen w-screen flex" id="Codebox_Screen">
      <div
        className="w-3/4 min-h-screen h-screen flex justify-center items-center flex-col"
        id="Codebox_editor"
      >
        <div className="bg-gray-900 w-full h-17 px-6 flex justify-between items-center">
          <Link to="/"><LogOut className="text-gray-400 rotate-180"/></Link>
          <span className="flex gap-4">
            <Theme editor={editor} />
            <Language editor={editor} SetLang={SetLang} Lang={Lang} />
          </span>
        </div>
        <textarea id="codebox" ref={HandelEditor}></textarea>
        <div className="bg-gray-900  w-full h-15 px-6 flex justify-between items-center">
          <span
            className="flex items-center gap-2 text-gray-400 cursor-pointer"
            id="Screen_Layout"
            onClick={ExpandScreen}
          >
            {isFullScreen == false ? (
              <>
                <Maximize size={20} /> Full Screen
              </>
            ) : (
              <>
                <Minimize size={20} /> Exit Full
              </>
            )}
          </span>
          <Button
            variant="contained"
            onClick={SendMsg}
            endIcon={<Play size={20} />}
          >
            RUN
          </Button>
        </div>
      </div>
      <div
        className="bg-gray-900 min-h-screen  w-1/4 flex flex-col justify-around items-center p-4"
        id="Codebox_I/O"
      >
        <div className=" w-full p-2 h-screen flex flex-col gap-2">
          <label htmlFor="Input" className="text-2xl font-medium text-gray-400">
            Input
          </label>
          <textarea
            name=""
            id="Input"
            className="bg-gray-800 text-gray-200 shadow-lg w-full h-50 p-2 border rounded resize-none border-gray-500 focus:outline-0"
            placeholder="Enter input here..."
          >
          </textarea>
        </div>
        <div className=" w-full p-2 h-screen flex flex-col gap-2">
          <label
            htmlFor="Output"
            className="text-2xl font-medium text-gray-400"
          >
            Output
          </label>
          <textarea
            name=""
            id="Output"
            className="bg-gray-800 text-gray-200 shadow-lg w-full h-80 p-2 border rounded resize-none border-gray-500 focus:outline-0"
            placeholder="Output will be shown here..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default Codebox;
