var express		= require("express");
	router		= express.Router()


//show admin dashboard
router.get("/admin", isLoggedIn, isAdmin, function(req, res){
	let totalBalance;
	let totalDailyWithdrawal;
	let totalDailyDeposit;


	function currentBalance(){
		let balance;
		User.find({},function(err, users){
		if(err){
			console.log(err);
		} else{
			let usersBalance = [];
			for (let i = 0; i < users.length; i++) {
				usersBalance.push(users[i].availableforwithdrawal);
			}
			balance = usersBalance.reduce(function(sum, deposit){
				return sum + deposit;
			}, 0);
		}
		totalBalance = balance || 0;
	})
}

function todaysWithdrawal(){
	User.find({}, function(err, users){
		let usersWithdrawal = [];
		let allWithdrawals = [];
		let allDailyWithdrawals;
		if(err){
			console.log(err);
		} else {
			for (let i = 0; i < users.length; i++) {
				usersWithdrawal.push(...users[i].withdrawalRequests);
			};
			for (let i = 0; i < usersWithdrawal.length; i++) {
				if(moment(usersWithdrawal[i].date).format('DD MM YY') == moment(req._startTime).format('DD MM YY') && usersWithdrawal[i].status == "Success - Disbursed"){
					allWithdrawals.push(usersWithdrawal[i].amount);
				}
	}
	allDailyWithdrawals = allWithdrawals.reduce(function(sum, deposit){
		return sum + deposit;
	  }, 0); 
	}
	totalDailyWithdrawal = allDailyWithdrawals || 0;
	})
}

function todaysDeposit(){
	User.find({}, function(err, users){
		let usersTransactions = [];
		let allDeposits = [];
		let allDailyDeposits = [];
		let totalDeposit;
		if(err){
			console.log(err);
		} else {
			for (let i = 0; i < users.length; i++) {
				usersTransactions.push(users[i].transactions);
			};
			for (let i = 0; i < usersTransactions.length; i++) {
		allDeposits.push(...usersTransactions[i]);
	}
	for (let i = 0; i < allDeposits.length; i++) {
		if (moment(allDeposits[i].date).format('LL') === moment(req._startTime).format('LL') && allDeposits[i].type === "Credit - Cash Deposit" || moment(allDeposits[i].date).format('LL') === moment(req._startTime).format('LL') && allDeposits[i].type === "Credit - Flix Card Deposit" || moment(allDeposits[i].date).format('LL') === moment(req._startTime).format('LL') && allDeposits[i].type === "Credit - Debit Card"){
			allDailyDeposits.push(allDeposits[i].amount)
			totalDeposit = allDailyDeposits.reduce(function(sum, deposit){
				  return sum + deposit;
				}, 0); 
			}
			}
			totalDailyDeposit = totalDeposit || 0;
	}
	res.render("admindash", {currentUser:req.user, totalBalance:totalBalance, totalDailyDeposit:totalDailyDeposit, totalDailyWithdrawal:totalDailyWithdrawal});
	})
}

todaysWithdrawal();
currentBalance();
todaysDeposit();
});

//Show withdrawal requests
router.get("/admin/withdrawalreq", isLoggedIn, isAdmin, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err)
		}
	res.render("withdrawalreq", {users:users, currentUser:req.user});
		})
	})
//View withdrawal requests
router.get("/admin/withdrawalreq/process/:id", isLoggedIn, isAdmin, function(req, res){
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
});	

// Process cash withdrawal requests
router.post("/admin/withdrawalreq/process", isLoggedIn, isAdmin, function(req, res){
//find the owner, if the users balance is lower than amount to withdraw, decline transaction.
let currentTransaction;
let newUserBalance;
function approveTransaction(){
	User.findOneAndUpdate({phone: 0 + req.body.owner}, {availableforwithdrawal:newUserBalance}, function(err, user){
		if(err){
			console.log(err);
		} else {
			let userRequests = user.withdrawalRequests;
			userRequests.forEach(function(transaction){
				if(String(transaction._id) == req.body.transactionId){
					transaction.status = "Approved";
					theRequest = transaction;
				}
			})
		}
	});
}
function declineTransaction(){
	userRequests.forEach(function(transaction){
	if(String(transaction._id) == req.body.transactionId){
		transaction.status = "Declined"
		currentTransaction = transaction;
	}
})
	};
User.findOne({phone: 0 + req.body.owner}, function(err, user){
	if(err){
		console.log(err);
	} else {
		userBalance = user.availableforwithdrawal;
		userRequests = user.withdrawalRequests;
		newUserBalance = userBalance - req.body.amount;
	if(userBalance < Number(req.body.amount)){
		declineTransaction();
		user.save();
		res.render("processwithdrawalreq", {transaction:currentTransaction, currentUser:req.user, message:'Transaction Has Been Declined Due To Insufficient Balance'});
	} else {
		approveTransaction();
		user.save();
		console.log(currentTransaction);
		res.render("processwithdrawalreq", {transaction:currentTransaction, currentUser:req.user, message:"Transaction Has Been Approved!"});
			}
		};
	});
});	
	


//Select Staff Type
router.get("/admin/staffmanagement", isLoggedIn, isAdmin, function(req, res){
	res.render("staffmanagement", {currentUser: req.user});
});

//View Existing Staff
router.get("/admin/staffmanagement/existingstaff", isLoggedIn, isAdmin, function(req, res){
	User.find({type: "Staff"}, function(err, staff){
		if(err){
			console.log(err);
		} res.render("staff", {currentUser: req.user, staff:staff})
	})
})

//process selected Staff
router.get("/admin/staffmanagement/existingstaff/:_id", isLoggedIn, isAdmin, function(req, res){
	res.render("staffProfile", {currentUser: req.user})
})

//View All Agent Applications
router.get("/agentapplications", isLoggedIn, isAdmin, function(req, res){
	User.find({type:"Applied as Agent"}, function(err, agent){
		if(err){
			console.log(err);
		} else {
			console.log(agent)
			res.render("agentapplications", {agent:agent, currentUser:req.user});
		}
	})

});



//View Selected Agent Application
router.get("/agentapplications/:id", isLoggedIn, isAdmin, function(req, res){
	console.log(req.params.id);
	res.render("agentapplications", {currentUser:req.user})
});

//View Admin History
router.get("/adminhistory", isAdmin, isLoggedIn, function(req, res){
	User.find({}, function(err, users){
		if(err){
			console.log(err)
		}
	res.render("adminhistory", {users:users, currentUser:req.user});
		})
	})

//show staff and agent page
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

router.get("/manageagents", isLoggedIn, isAdmin, function(req, res) {
   res.render("manageagents", {currentUser:req.user})
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
}//Grant Superuser Access
function isSuperUser(req, res, next){
	if(req.user.type === "superUser"){
		return next()
	} else {
		res.send("You Do Not Have Permission To View This Page");
	}
}


module.exports = router;