var mongoose=require("mongoose");
var Restro=require("./models/restaurant");
var data=[{
    name:"jodhpur high 1",
    image:"/images/rest4.jpg",
    desc:"mind boggling hotel with free wifi",
    menu:[  {itname:"gulab jamun",price:500}, 
            {itname:"gulab jamun",price:500}]
},
{
    name:"jodhpur high 2",
    image:"/images/rest3.jpg",
    desc:"mind boggling hotel with free wifi",
    menu:[  {itname:"gulab jamun",price:500}, 
            {itname:"gulab jamun",price:500}]
},
{
    name:"jodhpur high 3",
    image:"/images/rest1.jpg",
    desc:"mind boggling hotel with free wifi",
    menu:[  {itname:"gulab jamun",price:500}, 
            {itname:"gulab jamun",price:500}]
}
];
function seedDB(){
    
    Restro.remove({name:"jodhpur high 3"},(err)=>{
    if(err){
        console.log(err);
    }
    console.log("removed");
    data.forEach((seed)=>{
        Restro.create(seed,(err,restro)=>{
            if (err) {
                console.log(err);
            } else {
                console.log("added");
            }
        })
    })
})
};
        module.exports=seedDB; 