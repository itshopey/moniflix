var mongoose 				= require('mongoose'),
	passportLocalMongoose	= require('passport-local-mongoose');
    

    var transactionsSchema = new mongoose.Schema({
amount: Number,
type: String,
sender: String,
owner: String,
date: String,
status: String,
});

transactionsSchema.plugin(passportLocalMongoose);


    var withdrawSchema = new mongoose.Schema({
amount: Number,
type: String,
owner: String,
date: String,
status: String,
processedBy: String,
account: Number,
});

withdrawSchema.plugin(passportLocalMongoose); 

var userSchema = new mongoose.Schema({
	username: String,
	firstname: String,
	lastname: String,
	email: String,
	phone: String,
	referrer: String,
	dailydeposit: [Number],
	totaldeposit: Number,
	availableforwithdrawal: Number,
	bankName: String,
	accountNumber: String,
	accountName: String,
	password: String,
	type: String,
	withdrawalRequests: [withdrawSchema],
	transactions: [transactionsSchema]
});

userSchema.plugin(passportLocalMongoose);
//Database Model
module.exports = mongoose.model("User", userSchema);


