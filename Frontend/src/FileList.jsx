import  { useEffect ,useState} from 'react'
import {Link,useParams,useNavigate} from 'react-router-dom'
import { LogOut,ChevronLeft,Trash2,PencilLine,FilePlus,FileText,FileEdit, Code2 } from 'lucide-react'
import ViewFile  from "./ViewFile"
import {ToastContainer, toast } from "react-toastify";

function FileList() {
    const { id } = useParams();
    let navigate=useNavigate();
    let [fileData,SetfileData]=useState({});
    let [viewFileData ,SetviewFileData]=useState({
        id:"",
        name:"",
        date:""
    });
    async function GetFileData(){
        let res=await fetch(`http://localhost:3000/code/workplace/stroage/get/${id}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        let data=await res.json();
        SetfileData(data.files)
        return;
    }
    useEffect(()=>{
        GetFileData();
        return;
    },[id]);
    function showFileData(id,name,date){
        SetviewFileData({
            id:id,
            name:name,
            date:date
        })
    }
    async function deleteFile(folder_id,file_id){
        let res=await fetch(`http://localhost:3000/code/workplace/stroage/files/${folder_id}/add/delete/${file_id}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        })
        let data=await res.json();
        toast.success(data.message)
        SetviewFileData({
            id:"",
            name:"",
            date:""
        })
        GetFileData();
        return;
    }
    async function DeleteWorkspace(){
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
        console.log(data)
        toast.success(data.message)
        setTimeout(() => {
            navigate(`/code/workplace/stroage`)
        }, 1500);
        return;
    }
  return (
    <div className='w-screen min-h-screen h-max bg-gray-950 flex flex-col'>
        <ToastContainer position="top-center" autoClose={1000} theme="dark" />
        <div className="h-[10vh] bg-gray-900 flex justify-between px-10 z-1 items-center sticky top-0">
            <Link to="/"><LogOut className="text-gray-400 rotate-180"/></Link>
        </div>
        <div className='w-full h-max py-10 flex justify-center items-center text-white'>
            <div className='w-2/3  flex flex-col gap-5'>
                <Link to="/code/workplace/stroage"><span className='flex gap-1'><ChevronLeft/> Back to Workspace</span></Link>
                <div className='w-full  bg-gray-900 rounded-lg'>
                    <div className='h-[20vh] bg-gray-800 flex justify-between border-b-1 border-gray-700 items-center gap-10 px-5 rounded-t-lg'>
                        <span className='flex gap-2 flex-col'>
                            <h1 className='text-3xl font-semibold'>{fileData.folder_name} </h1>
                            <p className='text-gray-500  line-clamp-2'>{fileData.folder_description}</p>
                            <p className='text-gray-600 text-xs'>Created at : {fileData.folder_date}</p>
                        </span>
                        <span className='flex gap-5 text-gray-400'>
                            <Trash2 onClick={DeleteWorkspace} className='cursor-pointer'/>
                        </span>
                    </div>
                    <div className='flex  w-full'>
                        <div className='min-w-1/4 w-1/4  border-r-1 border-gray-700 p-5'>
                            <span className='flex justify-between items-center border-b-1  border-gray-700 pb-5'>
                                <h1 className='text-xl'>Files</h1>
                                <Link to={`/code/workplace/stroage/files/${id}/add`}><button className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer duration-200"><FilePlus size={20}/>Add file</button></Link>
                            </span>
                            <div className='h-[100vh] overflow-auto overflow-x-hidden scroll-smooth  '>
                                {fileData.files?fileData.files.map((file,index)=><FileContainer key={index} folder_id={id} file_id={file._id} name={file.file_name} date={file.file_date}/>):<div className='w-full p-10 flex justify-center items-center text-gray-500'>No files found</div>}
                            </div>
                        </div>
                        <ViewFile className="min-w-3/4 max-w-3/4 min-h-[100vh]" folder_id={id} file_id={viewFileData.id} name={viewFileData.name} date={viewFileData.date}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )

  function FileContainer({folder_id,file_id,name,date}){
    return(
        <div onClick={()=>{showFileData(file_id,name,date)}} className='gap-4 flex justify-between items-center my-3 text-gray-400 cursor-pointer hover:bg-gray-800 p-2 rounded-lg duration-200'>
            <span className='flex gap-2 items-center flex-1 overflow-hidden'>
                <FileText className='min-w-5 min-h-5 h-5 w-5'/>
                <p className='truncate'>{name}</p>
            </span>
            <Trash2 size={20} onClick={()=>{deleteFile(folder_id,file_id)}}/>
        </div>
    )
  }
}

export default FileList