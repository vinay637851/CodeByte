let express=require("express");
let app=express();
let port=process.env.PORT||3000
let path=require("path");
const cors = require('cors');
let bodyParser=require('body-parser') 
let compiler=require("compilex")
let options={stats:true}
let mongoose=require("./database.js")
const { ObjectId } = require('mongodb'); 
const fs = require('fs');
const fileUpload = require('express-fileupload'); 

const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const SUPABASE_URL='https://vwuwivxqtsxffxzcyjlc.supabase.co';
const SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3dXdpdnhxdHN4ZmZ4emN5amxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMzk5MDIsImV4cCI6MjA2MDgxNTkwMn0.WMexIJzTImrfJEkVCAzmwzI9wgSuPWB9LuHeYmHx4OI'

const supabase=createClient(SUPABASE_URL,SUPABASE_KEY)

const storage = multer.memoryStorage();  // Store file in memory (no disk)
const upload = multer({ storage: storage });

compiler.init(options);
app.use(cors());
app.use("/codemirror-5.65.19",express.static("C:/Users/KK/Desktop/MERN code editor/code_editor_project/Backend/node_modules/codemirror"))
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(fileUpload());



app.listen(port,function(){
    console.log("server started on port ",port)
})  


app.post("/code/workplace/compile",function(req,res){
    let {code,language,input}=req.body; 
    console.log(input) 
    if(language=="C++"){
        var envData = { OS : "windows" , cmd : "g++", options: { timeout: 5000 }};  
        if(input){
            compiler.compileCPPWithInput(envData , code , input , function (data) {
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output });
                compiler.flush(function(){console.log("Deleted")});
            }); 
        }
        else{
            compiler.compileCPP(envData , code , function (data) {
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output });
                compiler.flush(function(){console.log("Deleted")}); 
            });
        }
    } 
    else if(language=="Java"){
        var envData = { OS : "windows", options: { timeout: 5000 }};
        if(input){
            compiler.compileJavaWithInput( envData , code , input ,  function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output }); 
                compiler.flush(function(){console.log("Deleted")});
            });
        }
        else {
            compiler.compileJava( envData , code , function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output });
                compiler.flush(function(){console.log("Deleted")}); 
            }); 
        }
    }
    else if(language=="Python"){
        var envData = { OS : "windows", options: { timeout: 5000 }};
        if(input){
            compiler.compilePythonWithInput( envData , code , input ,  function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output }); 
                compiler.flush(function(){console.log("Deleted")});      
            });
        }
        else{
            compiler.compilePython( envData , code , function(data){
                if (res.headersSent) return;
                if (data.error) {
                    res.send({ error: data.error });
                    return;
                }
                res.send({ output: data.output }); 
                compiler.flush(function(){console.log("Deleted")}); 
            });   
        }
    } 
    
})

app.get("/code/workplace/stroage/get",async function(req,res){
    let db=mongoose.connection.db;
    let Workspace=db.collection("workspace");
    let data=await Workspace.find({}).toArray();
    res.send({workspaces:data});
    return;
})

app.get("/code/workplace/stroage/get/:id",async function(req,res){
    let {id}=req.params;
    let db=mongoose.connection.db;
    let Workspace=db.collection("workspace");
    let data=await Workspace.findOne({_id:new ObjectId(id)})
    res.send({files:data});
    return; 
})

app.post("/code/workplace/stroage/files/:id/add/create",async function (req,res) {
    let {file_name,language}=req.body;
    let {id}=req.params;
    let db=mongoose.connection.db;
    let workspace=db.collection("workspace");
    let fileData=await workspace.findOne({_id:new ObjectId(id)});
    const { data, error } = await supabase.storage
    .from('workspacefiles')
    .upload(`/${fileData.folder_name}/${file_name+language}`,{
      upsert: true,
    });
    console.log(data)
    if(fileData.files){
        let isExist=fileData.files.findIndex((file)=>file.file_name===file_name+language);
        if(isExist!=-1){
            res.send({error:"File already exists"});
            return;
        }
    }
    let date=new Date();
    await workspace.updateOne({_id:new ObjectId(id)},{$push:{files:{_id:new ObjectId(),file_name:file_name+language,file_date:date.toLocaleString()}}})
    res.send({message:"File created"});
    return; 
}) 
app.get("/code/workplace/stroage/files/:folder_id/add/access/:file_id",async function(req,res){
    let {folder_id,file_id}=req.params;
    let db=mongoose.connection.db; 
    let workspace=db.collection("workspace");
    let file=await workspace.findOne({_id:new ObjectId(folder_id)});
    let folder_name=file.folder_name;
    let file_name=file.files.find((file)=>file._id.toString()===file_id).file_name;
    const { data, error } = await supabase
    .storage
    .from('workspacefiles') 
    .createSignedUrl(`${folder_name}/${file_name}`, 60);
    const response = await fetch(data.signedUrl); 
    const content = await response.text(); 
    console.log(content);
    res.send({code:content}); 
})

app.post("/code/workplace/stroage/files/:folder_id/add/update/:file_id",async function(req,res){
    let {folder_id,file_id}=req.params;
    let {code}=req.body;
    let db=mongoose.connection.db;
    let workspace=db.collection("workspace");
    let file=await workspace.findOne({_id:new ObjectId(folder_id)});
    let folder_name=file.folder_name;
    let file_name=file.files.find((file)=>file._id.toString()===file_id).file_name;
    const { data, error } = await supabase.storage
    .from('workspacefiles')
    .upload(`/${folder_name}/${file_name}`,code,{
      upsert: true,
    });
    console.log(data)
    res.send({message:"File updated"});
})

app.post("/code/workplace/stroage/files/:folder_id/add/delete/:file_id",async function(req,res){
    let {folder_id,file_id}=req.params;
    let db=mongoose.connection.db;
    let workspace=db.collection("workspace");
    let file=await workspace.findOne({_id:new ObjectId(folder_id)});
    let folder_name=file.folder_name;
    let file_name=file.files.find((file)=>file._id.toString()===file_id).file_name;
    console.log(folder_name,file_name)
    const { data, error } = await supabase
    .storage
    .from('workspacefiles')     
    .remove([`${folder_name}/${file_name}`]);
    await workspace.updateOne({_id:new ObjectId(folder_id)},{$pull:{files:{_id:new ObjectId(file_id)}}})
    res.send({message:"File deleted"});
})

app.post("/code/workplace/stroage/create",async function(req,res){
    let {folder_name,folder_description}=req.body;
    let db=mongoose.connection.db;
    let Workspace=db.collection("workspace");
    let data=await Workspace.findOne({folder_name:folder_name});
    if(data){
        let AllData=await Workspace.find({}).toArray();
        res.send({message:"Workspace already exists",workspaces:AllData});
        return;
    }
    else{ 
        let date=new Date();
        await Workspace.insertOne({folder_name:folder_name,folder_description:folder_description,folder_date:date.toLocaleString()});
        let AllData=await Workspace.find({}).toArray();
        res.send({message:"Workplace created",workspaces:AllData});
    }
})

app.delete("/code/workplace/stroage/delete",async function(req,res){
    let {id}=req.body;
    let db=mongoose.connection.db; 
    let Workspace=db.collection("workspace");
    let file=await Workspace.findOne({_id:new ObjectId(id)});
    let folder_name=file.folder_name;
    const { data: files, error } = await supabase
    .storage
    .from("workspacefiles")
    .list(folder_name);
    const paths = files.map(file => `${folder_name}/${file.name}`);
    if (paths.length > 0) {
        const { error: deleteError } = await supabase
          .storage
          .from("workspacefiles")
          .remove(paths);
    }
    await Workspace.deleteOne({ _id: new ObjectId(id) });
    let AllData=await Workspace.find({}).toArray();
    res.send({message:"Workplace deleted",workspaces:AllData});
}) 




//this code right // app.get("/access",async function(req,res){
//     const { data, error } = await supabase
//     .storage
//     .from('workspacefiles') // your bucket
//     .download('queue.cpp') // your file path

//   try {
//     const content = await data.text(); 
//     console.log(content) 
//     res.send({data:"access"})
//   } catch (err) { 
//     res.send({data:"error"})
//   }
// })