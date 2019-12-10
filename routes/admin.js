var express		= require("express");
	router		= express.Router()

//show admin dashboard
router.get("/generatecards", isLoggedIn, isAdmin, function(req, res){
	res.render("cardgenerator", {currentUser:req.user});
	});

//show admin dashboard
router.get("/admin", isLoggedIn, isAdmin, function(req, res){
	User.find({},function(err, users){
		if(err){
			console.log(user);
		} else{
	res.render("admindash", {currentUser:req.user, users:users});
		}
	})
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

//Process withdrawal requests
// router.post("/admin/withdrawalreq/process", isLoggedIn, isAdmin, function(req, res){
// 	User.findOne({phone:0 + req.body.owner}, function(err, user){
// 		console.log(user)
// 		res.render()
// });


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



// 	console.log(req.params)
// 	User.findOne({_id:req.params._id})
// 	res.render("processagentapplication", {currentUser:req.user,})
// });


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