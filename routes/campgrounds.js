var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


//Index -Campground routes
router.get("/",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
	
});

//Create Route
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	
	var author = {
		id:req.user._id,
		username:req.user.username
	};
	var newCampground = {name:name,image:image,description:desc,author:author};
	Campground.create(newCampground,(err,newlyCreated)=>{
			if(err){
				console.log(err);
			}else{
				console.log(newlyCreated);
			res.redirect("/campgrounds");
			}		  
	});
});

//new Route
router.get("/new", middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");
});

//Show ; shows more info about one label
router.get("/:id",(req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
		if(err){
			console.log(err);
		}else{
				//console.log(foundCampground.comments);
				res.render("campgrounds/show",{campground:foundCampground});

		}
	});
	
	
});

//Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
		Campground.findById(req.params.id,(err,foundCampground)=>{
			res.render("campgrounds/edit",{campground:foundCampground}); 
		});
	});
//Update Campground Route
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// Destroy CampGround Route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,err=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");

		}
	});
});





module.exports = router;
