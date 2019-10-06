var mongoose=require("mongoose");
var DetailsSchema=new mongoose.Schema({
    name:{type:String,required:true},
    phone:{type:String}
    
});
module.exports=mongoose.model("Details",DetailsSchema);