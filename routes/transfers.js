var express		= require("express");
	router		= express.Router()

//TRANSFER TO MONIFLIX USER
//Show transfer form
router.get("/users/transfertouser", isLoggedIn, function(req, res){
	res.render("transfertouser", {message:"", currentUser:req.user})
});

//Post Route
router.post("/users/transfertouser", isLoggedIn, debitSender,  function(req, res){
	let transferAmount = req.body.transferAmount;
	if(req.user.availableforwithdrawal < transferAmount){
		res.render("transfertouser", {message:"Insufficient funds", currentUser:req.user})
	} else {
		var newSenderBalance = req.user.availableforwithdrawal - req.body.transferAmount;
		User.findOneAndUpdate({_id:req.user._id}, {availableforwithdrawal:newSenderBalance}, function(err, user){
			if(err){
				console.log(err);
			} else {
				user.transactions.push({
					amount: transferAmount,
					type: "Debit - Transfer To User",
					owner: req.body.accountNumber,
					date: req._startTime,
					status: "Success"
				});
				user.save();
				User.findOne({phone:0 + req.body.accountNumber}, function(err, user){
					if(err){
						res.render('transfertouser', {message: "Invalid Account Number", currentUser:req.user});
					} else {
						var receiverBal = Number(user.availableforwithdrawal) + Number(transferAmount) * 0.97;
						User.findOneAndUpdate({phone:0 + req.body.accountNumber}, {availableforwithdrawal:receiverBal}, function(err, user){
							if(err){
								res.render('transfertouser', {message: "Invalid Account Number", currentUser:req.user})
							} else {
								user.transactions.push({
									amount: transferAmount,
									type: "Credit - Transfer From User",
									sender: req.user.accountNumber,
									date: req._startTime,
									status: "Success"
								});
								user.save();
								res.render("transfertouser", {message:"Transfer Successful", currentUser:req.user})
							}
						})
					}
				})
			}
		})
	}
});
		

//MIDDLEWARES
//Debit sender 
function debitSender(req, res, next){
	var receiver = req.body.accountNumber
		var newSenderBalance = req.user.availableforwithdrawal - req.body.transferAmount;
		var transferAmount = Number(req.body.transferAmount);
		var transaction = {
			type: "Debit - Transfer To " + req.body.accountNumber,
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