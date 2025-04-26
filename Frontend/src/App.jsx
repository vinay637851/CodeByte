import CodeEditorTerminal from "./CodeEditorTerminal"
import Home from "./Home"
import Workspace from "./Workspace"
import FileList from "./FileList"
import AddFile from "./AddFile"


import './App.css'

import { BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          {/* <Route path="/code/workplace" element={<CodeEditorTerminal/>} /> */}
          <Route path="/code/workplace/stroage" element={<Workspace/>}/>
          {/* <Route path="/code/workplace/stroage/files/:id" element={<FileList/>}/>
          <Route path="/code/workplace/stroage/files/:id/add" element={<AddFile/>}/> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
