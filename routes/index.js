var express = require("express");
var router = express.Router();
var passport =require("passport");
var User = require("../models/user");


// root Route
router.get("/",function(req,res){
	res.render("landing");
});


//Auth Routes
router.get("/register",function(req,res){
	res.render("register");
});
//handle sign up logic
router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to Excursion-Guide " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
//show login form
router.get("/login",function(req,res){
	res.render("login");
});
//handling loginlogic
router.post("/login",passport.authenticate("local",{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),(req,res)=>{
	
});




//Log out route
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you Out!");
	res.redirect("/campgrounds");
});


module.exports = router;