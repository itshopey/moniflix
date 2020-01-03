const express		= require("express");
const router		= express.Router();
Card                = require('../models/cards');
moment              = require('moment');
                          moment().format();
const {initializePayment, verifyPayment} = require('../config/paystack')(request);


//MAKE DEPOSIT
//Show choose deposit type page
router.get("/users/deposit", isLoggedIn, function(req, res){
	res.render("deposittype", { currentUser: req.user })
});

//Show cash deposit form
router.get("/users/deposit/cashdeposit", isLoggedIn, function(req, res){
	res.render("cashdeposit", { currentUser: req.user, message:""})
});

//Make cash deposit
router.post("/users/deposit/", isLoggedIn, isAdmin, function(req, res){
	if(req.user.phone === 0+req.body.accountNumber){
		res.render("cashdeposit", {currentUser:req.user, message: "You cannot make cash deposits to your own account"})
	} else if(req.body.depositAmount < 100){
		res.render("cashdeposit", { currentUser: req.user,message:"You Cannot Deposit Below ₦ 100"})
	} else {
	User.findOne({phone: 0 + req.body.accountNumber}, function(err, user){
		if(!user){
			res.render("cashdeposit", {currentUser:req.user, message:"The Account Number Does Not Exist, Please Register The User"})
		} else {
			var newBalance = user.totaldeposit + Number(req.body.depositAmount);
			var availableForWithdrawal = newBalance * 0.97
			User.findOneAndUpdate({phone: 0 + req.body.accountNumber}, {totaldeposit:newBalance, availableforwithdrawal:availableForWithdrawal}, function(err, user){
				if(err){
					console.log(err);
				} else {
					var deposit = {
					amount: Number(req.body.depositAmount),
					type: "Credit - Cash Deposit",
					sender: req.user.username,
					owner: req.body.accountNumber,
					date: req._startTime,
					status: "Success",
					ref: 'TXN' + Math.floor((Math.random() * 1000000000) + 1)
								};
					user.transactions.push(deposit);
					user.save();
					res.render("cashdeposit", {message:"Deposit Successful", currentUser:req.user});
								}
							})
					}
				})
		}
});

//Deposit with Flix card
router.get("/users/deposit/flixcard", isLoggedIn, function(req, res){
	res.render("flixcard", { currentUser: req.user, message:""})
});

//Flix card post route
router.post("/users/deposit/flixcard", isLoggedIn, function(req, res){
	let cardPin = req.body.cardpin;
	Card.findOne({pin: cardPin}, function(err, card){
		if(card === null){
			res.render('flixcard', {currentUser: req.user, message:"Invalid Card Details"})
		} else if(card.status != "Unused"){
			res.render('flixcard', {currentUser:req.user, message:"This Card Has Already Been Used!"})
		} else {
			card.status = "Used";
			card.save();
		let availableforwithdrawal = req.user.availableforwithdrawal;
		let newBalance = (availableforwithdrawal + card.amount) * 0.97
		User.findOneAndUpdate({_id:req.user._id}, {availableforwithdrawal:newBalance}, function(err, user){
			if(err){
				console.log(err);
			} 	else {
				var deposit = {
				amount:card.amount,
				type: "Credit - Flix Card",
				date: req._startTime,
				ref: 'TXN' + Math.floor((Math.random() * 1000000000) + 1),
				status: "Success"
							};
				user.transactions.push(deposit);
				user.save();
				res.render("flixcard", {message:"Deposit Successful", currentUser:req.user});
							}
			})
		}
	})
})
			
//Show Debit-Card Deposit Form
router.get("/users/deposit/debitcard", isLoggedIn, function(req, res){
	res.render("debitcard", { currentUser: req.user, message:""})
});

//charge customer's debit card
router.post('/paystack/pay', (req, res) => {
    const form = _.pick(req.body,['amount','email','fullname']);
    form.metadata = {
        fullname : form.fullname
    }
    form.amount *= 100;
    initializePayment(form, (error, body)=>{
        if(error){
            //handle errors
            console.log(error);
            return;
	   }
	   response = JSON.parse(body);
	   res.redirect(response.data.authorization_url)
    });
});

//verify paystack transaction and credit user account
app.get('/paystack/callback', (req,res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error,body)=>{
        if(error){
            //handle errors appropriately
            console.log(error)
            // return res.redirect('/error');
		} else{
			response = JSON.parse(body);
			User.findOne({phone: req.user.phone}, function(err, user){
				if(err){
					console.log(err);
				}
			let depositAmount = response.data.amount / 100;
			let date = moment(response.data.transaction_date).format('LL');
			let newBalance = Number(user.availableforwithdrawal) + depositAmount;
			let availableForWithdrawal = newBalance * 0.97;
			let deposit = {
					amount: depositAmount,
					type: "Credit - Debit Card",
					owner: Number(req.user.phone),
					date: date,
					status: response.data.gateway_response,
					ref: response.data.reference
				}
			User.findOneAndUpdate({phone:req.user.phone}, {availableforwithdrawal:availableForWithdrawal}, function(err, user){
				if(err){
					console.log(err);
				} else {
					user.transactions.push(deposit);
					user.save().then(function(user){
						if(user){
							let message = "Dear " + req.user.firstname +", " + "Your Deposit Of NGN " + depositAmount + " was Successful And Your Account Has Been Credited";
					res.render('debitsuccess', {currentUser:req.user, message:message, date:date, type: "Credit - Debit Card", ref:response.data.reference });
						}
					}).catch((e)=>{
						console.log(e);
						})
					}
				})
			})
		}
    })
});


router.post("/users/deposit/debit-card", function(req, res) {
	console.log(res._body);
res.redirect("/users/deposit/debitcard")
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
