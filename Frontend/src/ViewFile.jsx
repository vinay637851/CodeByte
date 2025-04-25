import { useEffect, useState } from "react";
import { FileEdit, Code2, FileText, Save } from "lucide-react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";

import "codemirror/addon/edit/closebrackets.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/python/python.js";

import CodeMirror from "codemirror";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Language from "./Language";

function ViewFile({ folder_id, file_id, name, date }) {
    let navigate = useNavigate();
  let [editorExist, SeteditorExist] = useState(true);
  let [editor, Seteditor] = useState(null);
  let [codeData,setcodeData]=useState("");

  useEffect(() => {
    if (editor) {
      editor.setValue("");
      editor.toTextArea();
    }
    accessFileData();
    Seteditor(editor);
    SeteditorExist(true);
  }, [file_id]);

  async function accessFileData() {
    let res = await fetch(
      `http://localhost:3000/code/workplace/stroage/files/${folder_id}/add/access/${file_id}`,
      {
        method: "GET",
      }
    );
    let data = await res.json();
    codeData=data.code;
    setcodeData(codeData);
    document.getElementById("codebox").value = data.code;
  }
  const HandelEditor = async () => {
    if (editorExist) {
      editor = CodeMirror.fromTextArea(document.getElementById("codebox"), {
        mode: "text/x-c++src",
        theme: "dracula",
        lineNumbers: true,
        autoCloseBrackets: true,
      });
      editor.setSize("100%", "100%");
      if (name.includes(".cpp")) { 
        editor.setOption("mode", "text/x-c++src");
      } else if (name.includes(".java")) {
        editor.setOption("mode", "text/x-java");
      } else if (name.includes(".py")) {
        editor.setOption("mode", "text/x-python");
      }
      editorExist = false;
      SeteditorExist(false);
      let res = await fetch(
        `http://localhost:3000/code/workplace/stroage/files/${folder_id}/add/access/${file_id}`,
        {
          method: "GET",
        }
      );
      let data = await res.json();
      editor.setValue(data.code);
        codeData=data.code;
        setcodeData(codeData);
      Seteditor(editor);
    } else {
      let res = await fetch(
        `http://localhost:3000/code/workplace/stroage/files/${folder_id}/add/update/${file_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: editor.getValue(),
          }),
        }
      );
      let data = await res.json();
      toast.success(data.message);
      if (editor) {
        editor.setValue("");
        editor.toTextArea();
      }
      console.log(data);
      accessFileData();
      Seteditor(editor);
      SeteditorExist(true);
    }
  };
  function sendToEditor(){
    navigate(`/code/workplace`,{
        state:{
            code:codeData,
            language:name.includes(".cpp")
                ? "C++"
                : name.includes(".java")
                ? "Java"
                : "Python",
        }
    })
    return;
  }
  return (
    <div className="w-[100%] overflow-x-auto">
      <ToastContainer position="top-center" autoClose={1000} theme="dark" />
      {name != "" ? (
        <div className="w-[100%]  p-5">
          <div className="flex justify-between gap-2 items-center border-b-1  border-gray-700 h-[15vh]">
            <span className="flex gap-2 flex-col">
              <h1 className="text-xl line-clamp-1">{name}</h1>
              <p className="text-gray-500 text-xs">Last updated :- {date}</p>
            </span>
            <span className="flex gap-5 text-gray-400">
              <button onClick={sendToEditor} className="flex items-center cursor-pointer gap-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-sm">
                <Code2 size={20} />
                Editor
              </button>
              {editorExist ? (
                <button
                  onClick={HandelEditor}
                  className="flex items-center cursor-pointer text-nowrap gap-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 shadow-sm"
                >
                  <FileEdit size={20} />
                  Edit File
                </button>
              ) : (
                <button
                  onClick={HandelEditor}
                  className="flex items-center cursor-pointer text-nowrap gap-1 px-4 py-2 bg-green-800 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
                >
                  <Save size={20} />
                  Save
                </button>
              )}
            </span>
          </div>
          <div className="w-[100%] h-[100vh] h- p-5">
            <textarea
              name=""
              id="codebox"
              readOnly
              className="bg-gray-800 overflow-auto p-5 h-full w-full resize-none"
            ></textarea>
          </div>
        </div>
      ) : (
        <div className="w-100% min-h-[100vh] gap-5 flex flex-col justify-center items-center text-gray-600">
          <FileText size={60} />
          <h1 className="text-xl">
            Select a file to view or edit its contents
          </h1>
        </div>
      )}
    </div>
  );
}

export default ViewFile;
