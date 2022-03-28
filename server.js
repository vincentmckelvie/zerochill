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

mongoose.connect("mongodb+srv://"+process.env.MONGOUSER+":"+process.env.MONGOPW+"@cluster0.j6v3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
{
	useNewUrlParser:true,
	useUnifiedTopology:true,

});


const userSchema = new mongoose.Schema({
	email:{
		type:String,
		required:true,
	},
	tag:{
		type:String,
		required:true,
	},
	password:{
		type:String,
		required:true,
	},
	inapppurchases:{
		type:Object,
		required:true,
	},
	friends:{
		type:Object,
		required:true,
	},
	stats:{
		type:Object,
		required:true,
	},
	xp:{
		type:Number,
		required:true
	},
	level:{
		type:Number,
		required:true
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

passport.use(new localStrategy(function (email, password, done) {
	user.findOne({ email: email }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect email.' });

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
	const email = req.body.email;
	const user = req.body.username;
	const pw = req.body.password;

	const exists = await user.exists({ email: email });

	if (exists) {
		res.render('index.ejs',{user:null, error:{signuperror:"Email already exists."}});		
		return;
	};

	bcrypt.genSalt(10, function (err, salt) {
		
		if (err) return next(err);
		bcrypt.hash(pw, salt, function (err, hash) {
			if (err) return next(err);
			
			const newUser = new user({
				email: email,
				tag:user,
				password: hash,
				inapppurchases:{},
				friends:{},
				stats:{},
				xp:0,
				level:0
			});
			newUser.save();
			//res.redirect('/');
			res.render('index.ejs',{user:null, error:{loginerror:"Please sign in."}})
		});

	});
});

app.get('/', function(req, res, next) {
  if (!req.user) {
  	let error = null;
  	if(req.query.error){
  		error = "incorrect email or password.";
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