 //app config
 var bodyParser=require("body-parser"),
 method =require("method-override"),
 expressSanitizer=require("express-sanitizer"),
 mongoose      =require("mongoose"),
 express       =require("express"),
 app           =express(),
 flash        =require("connect-flash"),
 passport = require("passport"),
 LocalStrategy = require("passport-local"),
 passportLocalMongoose=require("passport-local-mongoose");
 const sgMail = require('@sendgrid/mail');
 const { Random } = require("random-js");
  const random = new Random();
  var sessionstore = require('sessionstore');
  mongoose.connect("mongodb+srv://vvip:rohan123@cluster0-g6oqn.mongodb.net/test?retryWrites=true&w=majority");
 app.set("view engine","ejs");
 app.use(express.static("public"));
 app.use(flash());
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(expressSanitizer());
 app.use(method("_method"));
 sgMail.setApiKey("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");
 
 //mongoose mondel configjRvkhM42fbY8yEQ
   
 var    Customer=require("./models/customer"),
     Details=require("./models/details"),
     Resauth=require("./models/resauth"),
    Restro=require("./models/restaurant"),
    Order=require("./models/order");
    //seedDB=require("./seeds");
   // seedDB();

  
    
 
 
 //==================================================
 //Passport config 
 //===================================================
 app.use(require("express-session")({
   store:sessionstore.createSessionStore(),
     secret: "achchA",
     resave: false,
     saveUninitialized: false,
   }));
   app.use(passport.initialize());
   app.use(passport.session());
   passport.use(new LocalStrategy(Customer.authenticate(),()=>{}));
   passport.serializeUser(Customer.serializeUser());
   passport.deserializeUser(Customer.deserializeUser());
   app.use((req,res,next)=>{
     res.locals.currentUser=req.user;
     res.locals.error=req.flash("error");
     res.locals.success=req.flash("success");
     next();
   });


   //==============================================
   //oauth  routes for customers
   //==============================================


   app.get("/register", (req, res) => {
    res.render("register");
  });
   app.post("/signbutton",(req,res)=>{
      res.redirect("/register");
    });
    app.post("/logbutton",(req,res)=>{
      res.redirect("/login");
    });
    
  app.post("/register", (req, res) => {
    const value = random.integer(100000, 999999);
    var newUser = new Customer({
      username: req.body.username,
      token:value,
      location:req.body.location
     
      
    });
   
    Details.create(req.body.details,(err,detail)=>{
      if (err) {
        console.log(err);
      } else {
        newUser.details.push(detail);
        newUser.save();
    }});
   
      
    
    
    Customer.register(newUser, req.body.password, (err, user) => {
      if (err) {
        req.flash("error",err.message)
        return res.render("register");
      }
      passport.authenticate("local",{failureFlash:req.flash("error","invalid credentials"),
      failureRedirect: "/login"})(req, res, () => {
        console.log(user.details);
        var text="Hey "+req.user.username+", Thank you for signing up on Xappal. Your confirmation otp is "+value+" . Please dont share your otp with anyone else. Happy Reading!!! Regards, Team Xappal"; 
        var texthtm="Hey "+req.user.username+",<br> Thank you for signing up on Xappal. Your confirmation otp is "+value+" . Please dont share your otp with anyone else.<br> <center><bold><h4>Happy Reading!!!</h4></bold></center><br> Regards,<br> Team Xappal"; 
        console.log(text)
          const msg = {
            to:req.user.username,
            from: 'xappalcare@gmail.com',
            subject: 'Confirm your Xappal account',
            text: text,
            html:texthtm
            
          };
          sgMail.send(msg);
        res.redirect("/otpverification");
      });
      app.get("/otpverification",(req,res)=>{
        res.render("otp");
      });
      app.post("/confirmation",(req,res)=>{
        if(req.body.otp==req.user.token)
        { Customer.findByIdAndUpdate(req.user._id,{$set:{isVerified:true}},(err,update)=>{
          if (err) {
            console.log(err);
          } else {
            req.flash("success","Welcome, you have been registered successfully")
            res.redirect("/index");
          }
        })
          
          
        }
        else{
          Customer.findByIdAndRemove(req.user._id,(err,removed)=>{
            if(err){
              console.log(err);
            }
            else{
              req.flash("error","Thanks for entering the wrong otp or trying to bypass the otp. Your account has been deleted.To use this service register again")
              res.redirect("/home");
            }
    
          })
        }
      })
    });
  });
  app.get("/login", (req, res) => {
    res.render("login");
  });

 
 
   app.post("/login", passport.authenticate("local", {
     successRedirect: "/index",
     failureRedirect: "/login"
   }), (req, res) => {
    
   });
   app.get("/logout", (req,res)=>{
     req.flash("success","Logged you out sucessfully")
     req.logout();
     res.redirect("/home");
   });

   function isLoggedIn(req,res,next){
     if(req.isAuthenticated()){
       return next();
     }
     req.flash("error","please login first");
     res.redirect("/login");
   };
   function isRestaurant(req,res,next){
     if(req.user.flag==true){
       return next();
     }
     res.redirect("/reslogin")
   }

  


  //=====================================
 // ordering routes
 //=======================================
 

 app.get("/",(req,res)=>{
     res.redirect("/home");
 });
 app.get("/home",(req,res)=>{
    res.render("homepage");
     
 });
 app.get("/index",isLoggedIn,(req,res)=>{
   
   if (!req.user.isVerified) {
    Customer.findByIdAndRemove(req.user._id,(err,removed)=>{
      if(err){
        console.log(err);
      }
      else{
       req.flash("error","You should be verified first.Your account has been deleted.To order register again")
        res.redirect("/home");
      }

    })
   } else {
     
   Customer.findById(req.user._id,(err,rest)=>{
    Restro.find({},(err,restro)=>{
      if (err) {
       req.logout();
       req.flash("error",err.message);
       res.redirect("/home");
      } else {
        res.render("index",{rest:restro});
      }
    })
   })
   }
  });
   app.get("/index/:id",isLoggedIn,(req,res)=>{
         Restro.findById(req.params.id,(err,foundRestro)=>{
             if (err) {
                req.flash("error","the Bookstore is not avaialable at the moment. Please try again Later");
                 res.redirect("/index")
                 
             } else {
                 res.render("restaurant",{restro:foundRestro})
                 
             }
         })
     });
     app.get("/checkout",(req,res)=>{
       Order.find({},(err,found)=>{
         if (err) {
          console.log(err);
         } else {
           console.log(found);
           res.render("checkout",{foundOrder:found})
         }
       })
     })
     app.get("/thanks",(req,res)=>{
       res.render("thanks");
       req.logout();
     })
     
  app.post("/checkout",isLoggedIn,(req,res)=>{
    for(var i=0;i<req.body.order.length;i++){
      if(req.body.order[i].itname=="nullified")
      {req.body.order.splice(i,1);
      i=0;}
    }
   var orderpp={
     restroname:req.body.restro,
     cusname:req.body.custo,
     deliveryadd:req.body.loc,
     bill:req.body.bill,
     items:req.body.order,
     deliveryslot:req.body.slot,
     payment:req.body.pay,
     roomdet:req.body.room
   };
   console.log(orderpp.items);
   Order.create(orderpp,(err,neworder)=>{
     if (err) {
       req.flash("error",err.message);
       res.redirect("/index");
     } else {
       var ord="";
       var orderhtm="<li>";
       for(var i=0;i<neworder.items.length;i++){
         ord=ord+neworder.items[i].itname+" x "+neworder.items[i].qty;
         if(i===neworder.items.length-1){
          orderhtm=orderhtm+neworder.items[i].itname+" x "+neworder.items[i].qty+"</li>"
         }
         else{
         orderhtm=orderhtm+neworder.items[i].itname+" x "+neworder.items[i].qty+"</li><li>";
       }
      }
       var x=neworder.id;
      var text="Hey "+neworder.cusname+", Thank you for ordering on Xappal. Your order id  is "+neworder.id+" . Your order items are as follows:-"+ ord+"Your total bill amount is "+neworder.bill +" and is to be paid via "+neworder.payment+" to Xappal. Happy ordering!!! Regards, Team Xappal"; 
      var texthtm="Hey "+neworder.cusname+",<br> Thank you for ordering on Xappal. Your order id is <b>"+neworder.id+"</b> . <br> Your order items are as follows:-<br><ul>"+orderhtm+"</ul><br>Your total bill amount is "+neworder.bill+" and is to be paid via "+neworder.payment+" to Xappal.<br> <center><bold><h4>Happy ordering!!!</h4></bold></center><br> Regards,<br> Team Xappal"; 
      console.log(texthtm);
      const msg = {
        to:neworder.cusname,
        from: 'xappalcare@gmail.com',
        subject: 'Your Xappal Order has been Confirmed',
        text: text,
        html:texthtm
        
      };
      sgMail.send(msg);
       console.log(neworder +"jkdjkd");
       res.redirect("/thanks");
       
     }
   })
  })

//  //new route
//  app.get("/blogs/new",isLoggedIn,(req,res)=>{
//      res.render("new");
//  });
//  //create route
//  app.post("/blogs",isLoggedIn,(req,res)=>{
//      req.body.blog.body=req.sanitize(req.body.blog.body);
//      Blog.create(req.body.blog,(err, newBlog)=>{
//          if(err){
//              res.render("new");
//          }
//          else{
//              res.redirect("/blogs");
//          }
//      })
//  });
//  app.get("/blogs/:id",(req,res)=>{
//      Blog.findById(req.params.id,(err,foundBlog)=>{
//          if (err) {
//              res.redirect("/blogs")
             
//          } else {
//              res.render("show",{blog:foundBlog})
             
//          }
//      })
//  });
//  app.get("/blogs/:id/edit",isLoggedIn,(req,res)=>{
//      Blog.findById(req.params.id,(err ,foundBlog)=>{
//          if (err) {
//              res.redirect("/blogs");
             
//          } else {
//              res.render("edit",{blog:foundBlog});
//          }
//      });
     
//  });
//  app.put("/blogs/:id",isLoggedIn,(req,res)=>{
//      req.body.blog.body=req.sanitize(req.body.blog.body);
//         Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
//          if (err) {
//              res.redirect("/blogs");
             
//          } else {
//              res.redirect("/blogs/"+req.params.id);
             
//          }
//      })
     
//  });
 
//  app.delete("/blogs/:id",isLoggedIn,(req,res)=>{
//      Blog.findByIdAndRemove(req.params.id,(err)=>{
//          if(err){
//              res.redirect("/blogs");
//          }
//          else{
//              res.redirect("/blogs");
//          }
//      })
//  });
 let port = process.env.PORT;
 if (port == null || port == "") {
   port = 8010;
 }
 
 app.listen(port,process.env.IP,()=>{
     console.log("started at "+port);
 
 });
 
 