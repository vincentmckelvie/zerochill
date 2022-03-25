require('dotenv').config()
const express = require("express");
const app = express();
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//console.log(process.env.MONGOUSER);
//console.log(process.env.MONGOPW);
//console.log(process.env.CONNECTSECRET);

mongoose.connect("mongodb+srv://"+process.env.MONGOUSER+":"+process.env.MONGOPW+"@cluster0.fvw04.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{
	useNewUrlParser:true,
	useUnifiedTopology:true,
});


const userSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true,
	},
	password:{
		type:String,
		required:true,
	}
})

const user = mongoose.model("User", userSchema)

app.set('view-engine','ejs');

app.use(express.static(__dirname+'/public'));

app.use(session({
  secret: ""+process.env.CONNECTSECRET+"",
  resave: false,
  saveUninitialized: true
}));

app.use(express.urlencoded({extended:false}));
app.use(express.json());

//passport
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	user.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new localStrategy(function (username, password, done) {
	user.findOne({ username: username }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect username.' });

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) return done(err);
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			
			return done(null, user);
		});
	});
}));


app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/?error=true'
}));

app.post('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/signup', function(req, res, next) {
	res.redirect('/')
});


app.post('/signup', async function(req, res, next) {
	//signUpHelper(req,res,next);
	const usr = req.body.username;
	const pw = req.body.password;

	const exists = await user.exists({ username: usr });

	if (exists) {
		res.render('index.ejs',{user:null, error:{signuperror:"user already exists."}});		
		return;
	};

	bcrypt.genSalt(10, function (err, salt) {
		
		if (err) return next(err);
		bcrypt.hash(pw, salt, function (err, hash) {
			if (err) return next(err);
			
			const newAdmin = new user({
				username: usr,
				password: hash
			});
			newAdmin.save();
			//res.redirect('/');
			res.render('index.ejs',{user:null, error:{loginerror:"Please sign in."}})
		});

	});
});

app.get('/', function(req, res, next) {
  if (!req.user) {
  	let error = null;
  	if(req.query.error){
  		error = "incorrect username or password.";
  	}
  	return res.render('index.ejs',{user:null, error:{loginerror:error} }); 
  }
  next();
}, function(req, res, next) {
  res.locals.filter = null;
  res.render('index.ejs', { user: req.user });
});


// app.get('/setup', async (req, res) => {
// 	const exists = await user.exists({ username: "admin" });
// 	if (exists) {
// 		res.render('index.ejs',{user:"exists",})		
// 		return;
// 	};
// 	bcrypt.genSalt(10, function (err, salt) {
// 		if (err) return next(err);
// 		bcrypt.hash("pass", salt, function (err, hash) {
// 			if (err) return next(err);
			
// 			const newAdmin = new user({
// 				username: "admin",
// 				password: hash
// 			});
// 			newAdmin.save();
// 			res.render('index.ejs',{user:"didnt exist"})
// 		});
// 	});
// });



app.listen(3005, ()=>{console.log("listening on 3005")});