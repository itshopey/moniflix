var express		= require("express");
	router		= express.Router()

//TRANSFER TO MONIFLIX USER
//Show transfer form
router.get("/users/transfertouser", isLoggedIn, function(req, res){
	res.render("transfertouser", {currentUser:req.user})
});

//Post Route
router.post("/users/transfertouser", isLoggedIn, function(req, res){
//Declare variables
	var transferAmount = Number(req.body.transferAmount);
	var senderBalance = req.user.availableforwithdrawal;
	var newSenderBalance = senderBalance - Number(transferAmount);
	var receiver = req.body.receiver;
	var transaction = {
		type: "Debit - Transfer To " + receiver,
		receiver: receiver,
		date: req._startTime,
		amount: req.body.transferAmount
	}
if(!req.body.transferAmount ){
	res.send("Please Fill All Fields routerropriately");
} else if(senderBalance < transferAmount){
	res.send("You Cannot Transfer Above Your Withdrawable Balance of " + senderBalance);
} else{
	User.findOneAndUpdate({username:req.user.username}, {availableforwithdrawal: newSenderBalance}, function(err, user){
		if(err){
			console.log(err);
		} else{
			user.transactions.push(transaction);
			user.save();
		}
	});
}
	
//Log transaction for sender
//Find receiver
//Get receiver's available for withdrawal balance
//Credit receiver's balance
//Log transaction for receiver

	
	res.redirect("/dashboard")
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