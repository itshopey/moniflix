var express		= require("express");
	router		= express.Router()
//AUTH ROUTES

//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "you will not be able to guess it",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//User sign up page
router.get("/users/signup", function(req, res){
		res.render("signup", {currentUser:""})
	});

//User sign up logic
router.post("/users/signup", function(req, res){
	var newUser = new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, type: "User", referrer:req.body.referral, totaldeposit: 0, availableforwithdrawal: 0});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err)
			return res.render('signup', {currentUser:""})
		}
		passport.authenticate("local")(req, res, function(){
		res.redirect("/welcome")
		});
	});
});

//Staff sign up logic
router.post("/staff/apply", function(req, res){
	var newStaff = new Staff({username: req.body.username, name: req.body.name, dob: req.body.dob, email: req.body.email, phone: req.body.phone, type: "Pending Staff Approval", nationality:req.body.nationality, currentCity: req.body.city, fullAddress: req.body.address, bvn: req.body.bvn});
	Staff.register(newStaff, req.body.password, function(err, staff){
		if(err){
			console.log(err)
			return res.render('becomeastaff', {message:"Please Check For Errors & Fill Required Fields", currentUser: req.user})
		}
		passport.authenticate("local")(req, res, function(){
		res.redirect("/staffDashboard")
		});
	});
});


//Show user signin form
router.get("/users/signin", function(req, res){
		res.render("signin", {error:'', currentUser:"" })
	});

//signin logic
router.post("/users/signin", passport.authenticate("local", {
	successRedirect: "/dashboard/",
	failureRedirect: "/users/signin",
}), function(req, res){
	if(err){
		res.render("signin", {error: "User Not Found"})
	}
	});

//Sign out logic
router.get("/users/logout", function(req, res){
	req.logout();
	res.redirect("/")
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
