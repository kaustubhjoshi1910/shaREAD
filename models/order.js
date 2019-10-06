var mongoose=require("mongoose");
var OrderSchema=new mongoose.Schema({
    restroname: {type:String,required:true},
    cusname:{type:String,required:true},
    deliveryadd:{type:String,required:true},
    bill:{type:Number,required:true},
    items:[
        
                {itname:{type:String,required:true},
                price:Number,
            qty:Number}
    ],
    deliveryslot:{type:String,required:true},
    dispatched:{type:String,default:"NO"},
    payment:{type:String,required:true},
    roomdet:{type:String,required:true}
   
});

module.exports=mongoose.model("Order",OrderSchema);