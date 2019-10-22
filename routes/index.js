var express		= require("express");
	router		= express.Router()
//Homepage
router.get("/", function(req, res){
	res.render("index");
});

//About Page
router.get("/about", function(req, res){
		res.render("about")
	});


//Services Page
router.get("/services", function(req, res){
		res.render("services")
	});


//Contact Page
router.get("/contact", function(req, res){
		res.render("contact")
	});
//Contact Post Page
router.post('/contact', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var subject = req.body.subject;
  var html = '<b>Hello World</b>';
  var message = "Hello MoniFlix Support, " + name + " has sent you the following message asking for support, Kindly attend to his request. Find Details below: " + 
  "Email: " + email + " " +
  "Subject: " + subject + " " +
  "Message: " + " ' " + req.body.message + " ' " +

  "Thank you for Your Swift Response!"
  

  if (!subject || !email || !name || !message) {
    res.send("Error: Pls fill in all fields, no field should not be Blank");
    return false;
  }

var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    secure: false, 
    port: 465, 
        auth: {
            user: 'moniflixng@gmail.com',
            pass: 'globaldiamond'
        }
});

var mailOptions = {
    from: "moniflixng@gmail.com",// from: "Moniflixng - <moniflixng@gmail.com>",
    to: "moniflixng@gmail.com",
    name: name, 
    email: email, 
    subject: subject + " From "+ name + " - Moniflixng",
    text: message,
}
smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
        res.render("error", { error: error});
        console.log(error);
    }else {
        res.send("Email has been sent successfully");
        console.log(req.body.message);
    }
});
});


//Terms & Conditions Page
router.get("/terms", function(req, res){
	res.render('terms')
});

// router.listen(process.env.PORT || 3000, function() {
//     console.log("LISTENING!");
// });


//Notifications Page
router.get("/users/notifications", isLoggedIn, function(req, res){
	res.render("notifications");
});

//Support Page
router.get("/support", function(req, res){
	res.render("support");
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