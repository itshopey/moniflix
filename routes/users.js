var express		= require("express");
	router		= express.Router()

//Show user welcome screen after signup
router.get("/welcome", isLoggedIn, function(req, res){
		res.render("welcome", {currentUser: req.user})
	});	

//Show user Dashboard page
router.get("/dashboard", isLoggedIn, calculateDailyDeposit, function(req, res){
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
router.get("/apply", isLoggedIn, function(req, res){
	res.render("becomeastaff", {currentUser:req.user})
});


//MIDDLEWARES
//Calculate User Daily Deposit
function calculateDailyDeposit(req, res, next){
	User.findOne({_id:req.user._id}, function(err, user){
if(err){
	console.log(err);
} else{
	var transactions = user.transactions
	for (var i = transactions.length - 1; i >= 0; i--) {
            if(transactions[i].date === req._startTime && transactions[i].type === "Credit - Cash Deposit" || transactions[i].type === "Credit - Debit Card Deposit" || transactions[i].type === "Credit - Flix Card Deposit" || transactions[i].type === "Credit - Transfer From "){
            	var dailyDeposit = transactions[i]
            	console.log(dailyDeposit)
            }
			
	}
	return next()
}
});
};

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