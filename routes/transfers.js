var express		= require("express");
	router		= express.Router()

//TRANSFER TO MONIFLIX USER
//Show transfer form
router.get("/users/transfertouser", isLoggedIn, function(req, res){
	res.render("transfertouser", {message:"", currentUser:req.user})
});

//Post Route
router.post("/users/transfertouser", isLoggedIn, debitSender,  function(req, res){
	User.findOne({phone: 0 + req.body.accountNumber}, function(err, user){
		if(err){
			console.log(err)
		}else {
	var receiverTotalDeposit = Number(user.totaldeposit) + Number(req.body.transferAmount);
	console.log(receiverTotalDeposit)
	var receiverBalance = Number(user.availableforwithdrawal) + Number(req.body.transferAmount);
	User.findOneAndUpdate({phone: 0 + req.body.accountNumber}, {availableforwithdrawal:receiverBalance, totaldeposit:receiverTotalDeposit}, function(err, user){
		if(err){
			res.render("transfertouser", {currentUser:req.user, message:"Invalid Account Number"})
		} else {
			user.transactions.push({
			type: "Credit - Transfer From " + Number(req.user.phone),
			Sender: Number(req.user.phone),
			date: req._startTime,
			amount: req.body.transferAmount
				})
			user.save();
	res.render("transfertouser", {currentUser:req.user, message:"Transfer Successful"})
		}
	})

		}
	})
	
})

//MIDDLEWARES
//Debit sender 
function debitSender(req, res, next){
	var receiver = req.body.accountNumber
		var newSenderBalance = req.user.availableforwithdrawal - req.body.transferAmount;
		var transferAmount = Number(req.body.transferAmount);
		var transaction = {
			type: "Debit - Transfer To " + receiver,
			receiver: receiver,
			date: req._startTime,
			amount: req.body.transferAmount
				};
	if(req.user.phone === 0+req.body.accountNumber){
		res.render("transfertouser", {currentUser:req.user, message: "You cannot transfer funds to yourself"})
	} else if(req.user.availableforwithdrawal < req.body.transferAmount){
		res.render("transfertouser", {currentUser:req.user, message: "You cannot transfer above your withdrawable balance of " + req.user.availableforwithdrawal})
	} else {
		
User.findOneAndUpdate({_id:req.user._id}, {availableforwithdrawal: newSenderBalance}, function(err, foundUser){
	foundUser.transactions.push(transaction)
	foundUser.save();
	return next()
})
	}
}

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