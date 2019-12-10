var mongoose 				= require('mongoose'),
	passportLocalMongoose	= require('passport-local-mongoose');

var cardSchema = new mongoose.Schema({
	pin:Number,
	amount: Number,
	status: String
	})



cardSchema.plugin(passportLocalMongoose);
//Database Model
module.exports = mongoose.model("Card", cardSchema);