var express		= require("express");
	router		= express.Router()

//TRANSFER TO MONIFLIX USER
//Show transfer form
router.get("/users/transfertouser", isLoggedIn, function(req, res){
	res.render("transfertouser", {message:"", currentUser:req.user})
});

//Post Route
router.post("/users/transfertouser", isLoggedIn, function(req, res){
//Declare variables
	var	sender = req.user
	var transferAmount = Number(req.body.transferAmount);
	var senderBalance = req.user.availableforwithdrawal;
	var newSenderBalance = senderBalance - Number(transferAmount);
	var receiver = req.body.accountNumber;
	var transaction = {
		type: "Debit - Transfer To " + receiver,
		receiver: receiver,
		date: req._startTime,
		amount: req.body.transferAmount
	};
if(senderBalance < transferAmount){
	res.render("transfertouser", {message: "You Cannot Transfer Above Your Withdrawable Balance of ₦ " + senderBalance, currentUser:req.user});
} else {
	User.findOneAndUpdate({_id:req.user._id}, {availableforwithdrawal: - transferAmount}, function(err, user){
		if(err){
	console.log(err)
	} else {
//Log transaction for sender
	user.save();
	user.transactions.push(transaction);
//Find and credit receiver's balance
	User.findOneAndUpdate({phone:0 + req.body.accountNumber}, {availableforwithdrawal: newSenderBalance}, function(err, foundUser){
		if(!foundUser){
			res.render("transfertouser", {currentUser: req.user, message: "This User Has Been Registered, Kindly Register The User"})
			} else{
//Log transaction for receiver
			// user.save();
			foundUser.transactions.push({
		type: "Credit - Transfer from " + req.user.phone,
		receiver: receiver,
		date: req._startTime,
		amount: req.body.transferAmount
	});
			res.render("transfertouser", {currentUser: req.user, message: "Transfer Successful!"})
					}
				});
			}
		});
	}
});

//MIDDLEWARES
//Sign in middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/users/signin")
};

//Grant Admin Access
function isAdmin(req, res, next){
	if(req.user.type === "Admin"){
		return next()
	} else {
		res.send("You Do Not Have Permission To View This Page");
	}
}


module.exports = router;