var express		= require("express");
    router		= express.Router();
    Card        = require('../models/cards')
    

// Show card generator
router.get('/admin/generateflixcard', isLoggedIn, isAdmin, function(req, res){
    res.render('cardgenerator', {currentUser:req.user, cards:""});
})

//Generate Flix Card
router.post('/admin/generateflixcard', isLoggedIn, isAdmin, function(req, res){
    let savedCards = [];
    for (let i = 0; i < req.body.quantity; i++) {
        let card = {
            pin: Math.floor(Math.random() * 10000000000) + 1,
            amount: req.body.amount,
            status: "Unused"
        }
    let generatedCard = new Card(card);
    generatedCard.save();
    savedCards.push(generatedCard);
    }
    res.render('cardgenerator', {currentUser: req.user, cards:savedCards})
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
