var createError 		= require('http-errors');
    express 			= require('express');    
    app 				= express();
	router 				= express.Router();
    path 				= require('path');
    cookieParser 		= require('cookie-parser');
    logger 				= require('morgan');
    bodyParser 			= require('body-parser');
    nodemailer 			= require('nodemailer');
    mongoose 			= require('mongoose');
    passport			= require('passport');
    LocalStrategy		= require('passport-local');
    Swal                = require('sweetalert2');
    User 				= require('./models/user');
    Transactions		= require('./models/transactions');
	moment 				= require('moment');
						  moment().format();


mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//ROUTES
var indexRouter 		= require('./routes/index');
var usersRouter 		= require('./routes/users');
var authRouter 			= require('./routes/auth');
var adminRouter 		= require('./routes/admin');
var depositRouter 		= require('./routes/deposit');
var withdrawalRouter 	= require('./routes/withdrawal');
var transfersRouter 	= require('./routes/transfers');
	
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(indexRouter);
app.use(usersRouter);
app.use(authRouter);
app.use(adminRouter);
app.use(depositRouter);
app.use(withdrawalRouter);
app.use(transfersRouter);

//Setting Up Database
mongoose.connect('mongodb://localhost/moniflix-app', {useNewUrlParser: true});



app.listen(process.env.PORT || 3000, function(){
    console.log("server Started")
})


module.exports = app;






					












