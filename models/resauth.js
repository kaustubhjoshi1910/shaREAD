var mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");
var ResauthSchema=new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String},
    restaurant:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restro"
    }],
    isRestro:{type:Boolean,default:false}
    
});
ResauthSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Resauth",ResauthSchema);