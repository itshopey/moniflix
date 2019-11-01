var express		= require("express");
	router		= express.Router()

//ADMIN STUFFS STARTS HERE
//show admin dashboard
router.get("/admin", isAdmin, isLoggedIn, function(req, res){
	User.find({},function(err, users){
		if(err){
			console.log(user);
		} else{
	res.render("admindash", {currentUser:req.user, users:users});
		}
	})
	});

//Show withdrawal requests
router.get("/admin/withdrawalreq", isAdmin, isLoggedIn, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err)
		}
	res.render("withdrawalreq", {users:users, currentUser:req.user});
		})
	})
//View withdrawal requests
router.get("/admin/withdrawalreq/process/:id", isAdmin, isLoggedIn, function(req, res){
			var id = req.params.id
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		} else{
			for (var i = users.length - 1; i >= 0; i--) {
			var userRequests = users[i].withdrawalRequests;
			userRequests.forEach(function(transaction){
				if(transaction.id === id){
					var currentTransaction = transaction
						res.render("processwithdrawalreq", {transaction:currentTransaction, currentUser:req.user, message:''});
					}
				})
				
			}
		}
	});
 	
	})

//Process withdrawal requests
router.post("/admin/withdrawalreq/process", isAdmin, isLoggedIn, function(req, res){
	User.findOne({phone:0 + req.body.owner}, function(err, user){
			var balance = user.availableforwithdrawal;
			var transaction = req.body.transactionId;
		if(balance < req.body.amount){
			var requests = user.withdrawalRequests;
		for (var i = requests.length - 1; i >= 0; i--) {
				if(requests[i]._id === req.body.transactionId){
					console.log(requests[i])
					User.updateOne({_id: reqId}, {status: "declined", processedBy: req.user.firstname})
					res.render("processwithdrawalreq")
				}
			}
		}
	})
});
				
// 		User.findOneAndUpdate({id: req.body.transactionId}, {status: "Declined - Insufficient Balance", processedBy: req.user._id}, function(err, user){
// 			if(err){
// 				console.log(err);
// 			} else {
// 				console.log(user)
// 				// user.save();
// 				var userRequests = user.withdrawalRequests;
// 			userRequests.forEach(function(request){
// 				if(request.id === req.body.transactionId){
// 					var currentTransaction = request;
// 				res.render("processwithdrawalreq", {message: "The User Does Not Have Sufficient Balance To Perform This Withdrawal, Transaction Has been Declined!", currentUser:req.user, transaction:currentTransaction });
		
// 			}

// 			})
// 	}
	
// 	})
// } else if(req.body.transactionStatus === "Pending") {
// 	User.findOneAndUpdate({phone:0 + req.body.owner}, {}, function(err, user){
// 		if(err){
// 			console.log(err);
// 		} else {
// 			for (var i = user.withdrawalRequests.length - 1; i >= 0; i--) {
// 				if(req.body.transactionId === user.withdrawalRequests[i]._id){
// 					console.log(user.withdrawalRequests[i])
// 					// user.withdrawalRequests.splice(user.withdrawalRequests[i], 1);

// 					user.save();
// 				}
// 			}
// 		}
// 	})















	// User.findOneAndUpdate({phone:0 + req.body.owner, "withdrawalRequests._id": req.body.transactionId}, {availableforwithdrawal: balance - req.body.amount, "withdrawalRequests.$.status": "Success - Debited", "withdrawalRequests.$.processedBy": req.user.username}, function(err, user){
	// 			if(err){
	// 				console.log(err);
	// 			} else {
	// 				var userRequests = user.withdrawalRequests;
	// 			userRequests.forEach(function(request){
	// 				if(request.id === req.body.transactionId){
	// 					var currentTransaction = request;
	// 				user.save();
	// 				res.render("processwithdrawalreq", {message: "Transaction Approved & User Has Been Debited! ", currentUser:req.user, transaction:currentTransaction });
			
	// 			}

	// 			})
	// 	}
		
	// 	})
// } else if(req.body.transactionStatus === "Success - Debited"){
// 	User.findOneAndUpdate({phone:0 + req.body.owner, "withdrawalRequests._id": req.body.transactionId}, {"withdrawalRequests.$.status": "Success - Disbursed", "withdrawalRequests.$.processedBy": req.user._id}, function(err, user){
// 				if(err){
// 					console.log(err);
// 				} else {
// 					var userRequests = user.withdrawalRequests;
// 				userRequests.forEach(function(request){
// 					if(request.id === req.body.transactionId){
// 						var currentTransaction = request;
// 					user.save();
// 					res.render("processwithdrawalreq", {message: "Cash Disbursed! ", currentUser:req.user, transaction:currentTransaction });
			
// 				}

// 				})
// 		}
		
// 		})
// } else if(req.body.transactionStatus === "Success - Disbursed"){
// 		var userRequests = user.withdrawalRequests;
// 			userRequests.forEach(function(request){
// 				if(request.id === req.body.transactionId){
// 					var currentTransaction = request;
// 				res.render("processwithdrawalreq", {message: "This Transaction Has Been Processed And Closed! ", currentUser:req.user, transaction:currentTransaction });
			
// 				}

// 				})
// 		}
// })
// });


//Show staff and agents
router.get("/staffandagents", isAdmin, isLoggedIn, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err);
		} else {
			res.render("staffandagents", {users:users,currentUser:req.user});
		}
	})

});


router.get("/adminhistory", isAdmin, isLoggedIn, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err)
		}
	res.render("adminhistory", {users:users, currentUser:req.user});
		})
	})

router.get('/staffandagents/:page', function(req, res, next) {
    var perPage = 10
    var page = req.params.page || 1

    User
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, users) {
            User.count().exec(function(err, count) {
                if (err) return next(err)
                	console.log(count);
                res.render("staffandagents", { users: users, current: page, pages: Math.ceil(count / perPage)
                })
            })
        })
})


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