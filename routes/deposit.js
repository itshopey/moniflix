var express		= require("express");
	router		= express.Router();

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
router.post("/users/deposit/", isLoggedIn, isAdmin, function(req, res){
	if(req.user.phone === 0+req.body.accountNumber){
		res.render("cashdeposit", {currentUser:req.user, message: "You cannot make cash deposits to your own account"})
	} else if(req.body.depositAmount < 100){
		res.render("cashdeposit", { currentUser: req.user,message:"You Cannot Deposit Below ₦ 100"})
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
					var deposit = {
					amount: Number(req.body.depositAmount),
					type: "Credit - Cash Deposit",
					sender: req.user.username,
					owner: req.body.accountNumber,
					date: req._startTime,
					status: "Success"
								};
					user.transactions.push(deposit);
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
	res.render("flixcard", { currentUser: req.user, message:""})
});

router.post("/users/deposit/flixcard", isLoggedIn, function(req, res){
	var cards = [
	{pin:1238709875,
	 amount: 100},
	 {pin:7585928371,
	 amount: 100},
	 {pin:1092783674,
	 amount: 100},
	 {pin:5896012947,
	 amount: 100},
	 {pin:2901827464,
	 amount: 100}
	]
	for (var i = cards.length - 1; i >= 0; i--) {
		if(cards[i].pin == req.body.cardpin){
			var card = cards[i];
		User.findOne({_id:req.user._id}, function(err, user){
			if(err){
				console.log(err);
			} else {
			var newBalance = user.totaldeposit + Number(card.amount);
			var availableForWithdrawal = newBalance * 0.97
			User.findOneAndUpdate({_id:req.user._id}, {totaldeposit:newBalance, availableforwithdrawal:availableForWithdrawal}, function(err, user){
				if(err){
					console.log(err);
				} else {
					var deposit = {
					amount: Number(card.amount),
					type: "Credit - Cash Deposit",
					sender: req.user.username,
					owner: req.body.accountNumber,
					date: req._startTime,
					status: "Success"
								};
					user.transactions.push(deposit);
					user.save();
					res.render("flixcard", {message:"Deposit Successful", currentUser:req.user});
								}
							})
			}
		})
		}
	}
});

//Show Debit-Card Deposit Form
router.get("/users/deposit/debitcard", isLoggedIn, function(req, res){
	res.render("debitcard", { currentUser: req.user, message:""})
});

//Show Debit-Card Deposit Form
router.post("pay", isLoggedIn, function(req, res){
	res.redirect("https://voguepay.com/pay/")
	console.log(res)
	console.log(response)
	res.render("debitcard", { currentUser: req.user, message:""})
});


router.post("/users/deposit/add-transaction", function(req, res) {
	// console.log(req.user);
	const body = req.body;
	console.log(body)

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
