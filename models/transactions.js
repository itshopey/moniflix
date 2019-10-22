var mongoose 				= require('mongoose'),
	passportLocalMongoose	= require('passport-local-mongoose');
    User					= require('../models/user');

	



var transactionsSchema = new mongoose.Schema({
amount: Number,
type: String,
sender: String,
receiver: String,
date: String,
status: String,
});

transactionsSchema.plugin(passportLocalMongoose);
//Database Model
module.exports = mongoose.model("Transactions", transactionsSchema);


