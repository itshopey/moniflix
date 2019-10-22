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
		res.render("signup")
	});

//User sign up logic
router.post("/users/signup", function(req, res){
	var newUser = new User({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone, type: "User", dailydeposit: 0, totaldeposit: 0, availableforwithdrawal: 0});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err)
			return res.render('signup')
		}
		passport.authenticate("local")(req, res, function(){
		res.redirect("/welcome")
		});
	});
});


//Show user signin form
router.get("/users/signin", function(req, res){
		res.render("signin", {error:'' })
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