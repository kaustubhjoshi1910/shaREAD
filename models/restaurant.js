var mongoose=require("mongoose");
var RestroSchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String,required:true},
    desc:{type:String,required:true},
    location:{type:String},
    menu:[
        
                {itname:String,
                price:Number,
                veg:String,
            cuisine:String}
    ],
  
    
   
});

module.exports=mongoose.model("Restro",RestroSchema);