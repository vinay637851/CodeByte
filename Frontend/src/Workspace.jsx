import {Link,useNavigate} from "react-router-dom"
import { LogOut ,Plus,ChevronLeft,FileCode2,Dot,Trash2} from "lucide-react";
import {ToastContainer, toast } from "react-toastify";
import { useState ,useEffect} from "react";



function Codebase() {
  let [arr,Setarr]=useState(null);
  
  useEffect(function(){
    getWorkspaces()
    async function getWorkspaces(){
      try{
        let res=await fetch("http://localhost:3000/code/workplace/stroage/get",{
          method:"GET",
          headers:{
            "Content-Type":"application/json"
          }
        })
        let data=await res.json();
        console.log(data.workspaces)
        Setarr([...data.workspaces])
        return;
      }
      catch(err){
        console.log(err);
        return;
      }
    }
  },[])
  function ShowWorkspaceform(){
    document.getElementById("Show_Button").classList.toggle("hidden")
    document.getElementById("Workspace_place").classList.toggle("hidden");
    if(document.getElementById("Workspace_form").classList.contains("hidden")){
      document.getElementById("Workspace_form").classList.remove("hidden")
      document.getElementById("Workspace_form").classList.add("flex");
    }
    else{
      document.getElementById("Workspace_form").classList.remove("flex")
      document.getElementById("Workspace_form").classList.add("hidden");
    }
  }
  async function handleForm(e){
    e.preventDefault();
    try{
      let res=await fetch("http://localhost:3000/code/workplace/stroage/create",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          folder_name:e.target.folder_name.value,
          folder_description:e.target.folder_description.value
        })
      })
      let data=await res.json();
      console.log(data.workspaces)
      if(data.message==="workspace already exists"){
        toast.warning(data.message);
        e.target.reset();
      }
      else{
        toast.success(data.message)
        Setarr([...data.workspaces])
        ShowWorkspaceform()
      }
    }
    catch(err){
      console.log(err);
    }
    e.target.reset();
  }
  async function DeleteWorkspace(id){
    console.log(id)
    try{
      let res=await fetch("http://localhost:3000/code/workplace/stroage/delete",{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          id:id
        })
      })
      let data=await res.json();
      console.log(data.workspaces)
      Setarr([...data.workspaces])
      toast.success(data.message)
      return;
    }
    catch(err){
      console.log(err);
      return;
    }
  }

  return (
    <div className="w-screen bg-gray-950 min-h-screen h-max flex flex-col">
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />
        <div className="h-[10vh] bg-gray-900 flex justify-between px-10 z-1 items-center sticky top-0">
            <Link to="/"><LogOut className="text-gray-400 rotate-180"/></Link>
            <button id="Show_Button" className="flex gap-1 bg-blue-600 px-2 py-2 rounded-lg text-white text-base hover:bg-blue-700 cursor-pointer" onClick={ShowWorkspaceform}><Plus/> Create Workspace</button>
        </div>
        <div className="h-max relative">
          <div id="Workspace_form" className="bg-gray-950 w-screen h-[90vh] hidden absolute justify-center  items-center text-white">
            <div className="w-2/3 p-5 flex flex-col gap-5">
              <span className="flex gap-1 cursor-pointer" onClick={ShowWorkspaceform}><ChevronLeft/> Back to Workspace</span>
              <form action="" onSubmit={handleForm} className="bg-gray-900 flex flex-col gap-10 p-5 rounded-lg">
                <h1 className="text-3xl font-semibold">Create a new workspace</h1>
                <label htmlFor="" className="flex flex-col gap-2"> Workspace name
                  <input type="text" name="folder_name" required  className="w-full p-2 bg-gray-800 rounded-lg  focus:outline-blue-400 focus:outline-1" />
                </label>
                <label htmlFor="" className="flex flex-col gap-2"> Description (optional)
                  <textarea name="folder_description"  rows={5} placeholder="Description of your workspace" className="w-full p-2 resize-none bg-gray-800 rounded-lg focus:outline-blue-400 focus:outline-1"></textarea>
                </label>
                <button type="submit" className="py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-lg">Create workspace</button>
              </form>
            </div>
          </div>
          <div id="Workspace_place" className="w-screen h-max bg-gray-950 absolute  text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10">
              {arr!=null?(arr.map(function(ele,idx){
                return <Container key={idx} id={ele._id} title={ele.folder_name} description={ele.folder_description} totalFiles={ele.files?ele.files.length:0}/>
              })):null}
          </div>
        </div>
    </div>
  );
  function Container({id,title,description,totalFiles}){
    const navigate = useNavigate();
    function handleCardClick() {
      navigate(`/code/workplace/stroage/files/${id}`);
    }
    function handleDeleteClick(e) {
      e.preventDefault(); 
      e.stopPropagation();
      DeleteWorkspace(id);
    }
    return(
      <div onClick={handleCardClick} className="bg-gray-800 flex flex-col gap-3 cursor-pointer  text-white p-3 px-5 rounded-2xl hover:outline-1 hover:outline-blue-700 h-[155px]">
        <h1 className="text-xl font-semibold flex gap-2  justify-between items-center"><span className="line-clamp-1">{title}</span><Trash2 size={20} onClick={handleDeleteClick} className="text-gray-500 cursor-pointer"/></h1>
        <p className="text-gray-500 text-lg line-clamp-2">{description}</p>
        <span className="flex gap-3">
          <span className="flex gap-1 items-center text-base text-gray-500">
            <FileCode2 size={15}/> {totalFiles} Files
          </span>
          <span className="flex gap-0.5 items-center text-base text-gray-500">
            <Dot className="text-green-500 " size={20}/>Active
          </span>
        </span>
      </div>
    )
  }
}



export default Codebase;