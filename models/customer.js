var mongoose=require("mongoose"),
    passportLocalMongoose=require("passport-local-mongoose");
var CustomerSchema=new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String},
    details:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Details",
        required:true
    }],
    token:{type:Number},
    isVerified:{type:Boolean,default:false},
    location:{type:String}
});
CustomerSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Customer",CustomerSchema);