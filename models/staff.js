var mongoose 				= require('mongoose'),
	passportLocalMongoose	= require('passport-local-mongoose');

var staffSchema = new mongoose.Schema({
	name: String,
	dob: Date,
	nationality: String,
	phone: String,
	type: String,
	currentCity: String,
	fullAddress: String,
	bvn: String,
	applicationDate: String,
	status: String,
	approvalDate: String,
	withdrawals: [],
	deposits: [],
});


staffSchema.plugin(passportLocalMongoose);
//Database Model
module.exports = mongoose.model("Staff", staffSchema);


