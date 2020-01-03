var express		= require("express");
	router		= express.Router()



//MAKE WITHDRAWAL
//Show choose withdrawal type page
router.get("/users/withdrawal", isLoggedIn, function(req, res){
	res.render("withdrawaltype", { currentUser: req.user })
});

//Show cash withdrawal form
router.get("/users/withdrawal/cashwithdrawal", isLoggedIn, function(req, res){
	res.render("cashwithdrawal", { currentUser: req.user, message: ""})
});

//Cash withdrawal post route
router.post("/users/withdrawal", isLoggedIn, function(req, res){
	var withdrawalAmount = Number(req.body.withdrawalAmount);
	var availableforwithdrawal = req.user.availableforwithdrawal;
	if(withdrawalAmount < 500 ){
	res.render("cashwithdrawal", { currentUser: req.user, message:"You Cannot Withdraw Below ₦ 500" })
	} else if(withdrawalAmount > availableforwithdrawal){
	res.render("cashwithdrawal", { currentUser: req.user, message:"You cannot Withdraw Above Your Withdrawable Balance Of ₦ " + availableforwithdrawal });
	}else{
		User.findOne({username: req.user.username}, function(err, user){
			if(err){
				console.log(err);
			} else{
				var transaction = {
					type: "Cash Withdrawal Request",
					date: new Date(req._startTime),
					amount: req.body.withdrawalAmount,
					status: "Pending",
					owner: req.user.firstname,
					account: req.user.phone,
					ref: 'TXN' + Math.floor((Math.random() * 1000000000) + 1)
				}
				user.withdrawalRequests.push(transaction);
				user.transactions.push(transaction);
				user.save();
	res.render("cashwithdrawal", {currentUser: req.user, message: "Cash Withdrawal Request Submitted Sucessfully"});
			}
		})
	};
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