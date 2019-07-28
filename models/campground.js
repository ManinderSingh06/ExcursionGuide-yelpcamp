var mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);

//Remove comment before removing a campground


var campgroundSchema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	author :{
		id: {
			type: mongoose.Schema.Types.ObjectId,
 	        ref : "User"
		},
		username:String	
	},
	comments:[
	{
	type:mongoose.Schema.Types.ObjectId,
	ref:"Comment"
}
	]
});
const Comment = require('./comment');
campgroundSchema.pre('remove', async function() {
	await Comment.remove({
		_id: {
			$in: this.comments
		}
	});
});


module.exports = new mongoose.model("Campground",campgroundSchema);