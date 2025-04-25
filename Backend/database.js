let mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/CodeEditor")
.then(function(res){
    console.log("Connected to database successfully");
})
.catch(function(err){
    console.log("Error in connecting to database",err);
})
module.exports=mongoose;