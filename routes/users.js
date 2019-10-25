var express		= require("express");
	router		= express.Router()

//Show user welcome screen after signup
router.get("/welcome", isLoggedIn, function(req, res){
		res.render("welcome", {currentUser: req.user})
	});	

//Show user Dashboard page
router.get("/dashboard", isLoggedIn, function(req, res){
	//find current user
	User.findOne({_id:req.user._id}, function(err, user){
	//find his transactions
		var userTransactions = user.transactions
	//find transactions that are deposits and store them in an array
	for(var i = userTransactions.length - 1; i >= 0; i--) {
		if(userTransactions[i].type === "Credit - Cash Deposit" || "Credit - Flix Card" || "Credit - Debit Card" ){
				var deposit =[];
				deposit.push(userTransactions[i]);
			}
	}
		userTransactions.forEach(function(transaction){
			
		});		
	});
	//sum the array and send the value to the dashboard

    res.render("dashboard", { currentUser: req.user, message: "" })
});


//User Profile
router.get("/users/profile", isLoggedIn, function(req, res){
	res.render("profile", {currentUser:req.user, message: ""});
	});
//Account Settings Form
router.get("/users/profile/settings", isLoggedIn, function(req, res){
	res.render("accountsettings", {currentUser:req.user, message:""});
});

//Account Settings Update Route
router.post("/users/profile/settings", isLoggedIn, function(req, res){
User.findOneAndUpdate({username:req.user.username}, {bankName:req.body.bankName, accountNumber:req.body.accountNumber, accountName:req.body.accountName}, function(){
	if(!req.body.bankName || !req.body.accountNumber || !req.body.accountName){
		res.render("accountsettings", {currentUser:req.user, message:"Please Fill All Fields"})
	} else {
		res.render("profile", {currentUser:req.user, message: "Details Updated!"})
	}
} );
});

//Password Update form
router.get("/users/updatepassword", isLoggedIn, function(req, res){
	res.render("passwordreset", {currentUser:req.user});
});

router.post("/users/updatepassword", isLoggedIn, function(req, res){
	if(req.body.oldPassword === req.user.password && req.body.newpassword === req.body.newpassword2){
	User.findOneAndUpdate({username:req.user.username}, {password:req.body.newpassword})
	}

})
//History route
router.get("/history/", isLoggedIn, function(req, res){
	res.render("history", {currentUser:req.user});
	});


//Notifications
router.get("/users/notifications", isLoggedIn, function(req, res){
	res.render("notifications")
})

//AGENT APPLICATION
router.get("/agents/apply", isLoggedIn, function(req, res){
	res.render("applyasagent", {currentUser:req.user})
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