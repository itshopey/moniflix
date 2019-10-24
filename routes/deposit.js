var express		= require("express");
	router		= express.Router()

//MAKE DEPOSIT
//Show choose deposit type page
router.get("/users/deposit", isLoggedIn, function(req, res){
	res.render("deposittype", { currentUser: req.user })
});

//Show cash deposit form
router.get("/users/deposit/cashdeposit", isLoggedIn, function(req, res){
	res.render("cashdeposit", { currentUser: req.user, message:""})
});

//Make cash deposit
router.post("/users/deposit/", isAdmin, isLoggedIn, function(req, res){
	if(req.body.depositAmount < 100){
		res.send("You Cannot Deposit Below ₦ 100")
	} else {
	User.findOne({phone: 0 + req.body.accountNumber}, function(err, user){
		if(!user){
			res.render("cashdeposit", {currentUser:req.user, message:"The Account Number Does Not Exist, Please Register The User"})
		} else {
			var newBalance = user.totaldeposit + Number(req.body.depositAmount);
			var availableForWithdrawal = newBalance * 0.97
			User.findOneAndUpdate({phone: 0 + req.body.accountNumber}, {totaldeposit:newBalance, availableforwithdrawal:availableForWithdrawal}, function(err, user){
				if(err){
					console.log(err);
				} else {
					user.transactions.push({
					amount: Number(req.body.depositAmount),
					type: "Credit - Cash Deposit",
					sender: req.user.username,
					receiver: req.body.accountNumber, 
					date: req._startTime,
					status: "Success"
								})
					user.save();
					res.render("cashdeposit", {message:"Deposit Successful", currentUser:req.user});
								}
							})
					}
				})
		}
});

//Deposit with Flix card
router.get("/users/deposit/flixcard", isLoggedIn, function(req, res){
	res.render("flixcard", { currentUser: req.user})
});

router.post("/users/deposit/flixcard", isLoggedIn, function(req, res){

});

//Show Debit-Card Deposit Form
router.get("/users/deposit/debitcard", isLoggedIn, function(req, res){
	res.render("debitcard", { currentUser: req.user})
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