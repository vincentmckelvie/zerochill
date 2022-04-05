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
//console.log(process.env.MONGOSERVER);

mongoose.connect("mongodb+srv://"+process.env.MONGOUSER+":"+process.env.MONGOPW+"@"+process.env.MONGOSERVER,
{
	useNewUrlParser:true,
	useUnifiedTopology:true,
});

const inApps = [
	 {
      name: 'created login',
      purchased: true,
      description: 'select different color swatches all different classes.',
      skew: '0001',
      icon: "createdlogin"
    }
]

const userSchema = new mongoose.Schema({
	email:{
		type:String,
		required:true,
		lowercase:true
	},
	username:{
		type:String,
		required:true,
	},
	password:{
		type:String,
		required:true,
	},
	inapppurchases:{
		type: Array,
		required:true,
	},
	friends:{
		type:Array,
		required:true,
	},
	friendrequests:{
		type:Array,
		required:true,
	},
	stats:{
		type:mongoose.Schema.Types.Mixed,
		required:true,
	},
	xp:{
		type:Number,
		required:true
	},
	bux:{
		type:Number,
		required:true
	},
	createdAt:{
		type:Date,
		immutable:true,
		required:true,
		default: ()=> Date.now()
	},
	online:{
		type:Boolean,
		required:true
	},
	game:{
		type:String,
		required:true
	},
	icon:{
		type:String,
		required:true
	}

})


const user = mongoose.model("User", userSchema);

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
	
	user.findOne({ email: username }, function (err, user) {
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
	const usr = req.body.username;
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
				username:usr+"#"+Math.floor(1000 + Math.random() * 9000),
				password: hash,
				inapppurchases:inApps,
				friends:[],
				friendrequests:[],
				stats:{killCount:0, deathCount:0},
				xp:0,
				bux:0,
				online:false,
				game:"none",
				icon:"accountcreated"
			});
			newUser.save();
			res.render('index.ejs',{user:null, error:{loginerror:"Please sign in."}})
		});
	});
});

app.get('/', function(req, res, next) {
  if (!req.user) {
  	let error = null;
  	if(req.query.error){
  		error = "Incorrect email or password.";
  	}
  	return res.render('index.ejs',{user:null, error:{loginerror:error} }); 
  }
  next();
}, async function(req, res, next) {
  res.locals.filter = null;
  //const usr = await user.findOne({_id:req.user._id});
  res.render('index.ejs', { user: req.user });
});



app.get("/endgame", async function(req, res) {
   
    let xpAdd = 0;
    let deathCount = 0;
    let killCount = 0;
  	
  	if(req.query.xpAdd){
  		xpAdd = parseInt(req.query.xpAdd);
  	}
  	if(req.query.deathCount){
  		deathCount = parseInt(req.query.deathCount);
  	}
  	if(req.query.killCount){
  		killCount = parseInt(req.query.killCount);
  	}
  	
  	try{
			
			const usr = await user.findOneAndUpdate({username:req.user.username},{$inc:{xp:xpAdd, "stats.killCount":killCount, "stats.deathCount":deathCount}});
			res.send({xpTotal:usr.xp, xpAdd:xpAdd, deathTotal:usr.stats.deathCount, deathAdd:deathCount, killTotal:usr.stats.killCount, killAdd:killCount});
			
		}catch(e){
			console.log(e.message);
		}

  	//addEndGameInfo(req, res, {xpAdd:xpAdd, totalDamage:totalDamage, killCount:killCount})
  	
})

app.get("/addfriend", async function(req, res) {
	const username = req.query.user;
	const exists = await user.exists({ username: username });
	if (!exists) {
		res.send({error:"user doesn't exist"});
		return;
	};

	if(username == req.user.username){
		res.send({error:"try a username that is not your own"});
		return;
	}

	if(checkIfAlreadyInFriendRequestsArray(req.user.friendrequests, username)){
		res.send({error:"already has sent friend request"});
		return;
	}
	if(checkIfAlreadyInFriendRequestsArray(req.user.friends, username)){
		res.send({error:"already your friend"});
		return;
	}

	try{
		const usr = user.findOneAndUpdate({username:username}, {$addToSet: {friendrequests : req.user}},  (err, doc)=>{}); //add in app purchase to array 
		res.send({error:null});
	}catch(e){
		res.send({error:"user doesn't exist :/"});
	}
  //addEndGameInfo(req, res, {xpAdd:xpAdd, totalDamage:totalDamage, killCount:killCount})
  	
})

app.get("/denyfriend", async function(req, res) {
	
	const username = req.query.user;
	
	try{
		const rr = user.findOneAndUpdate({_id:req.user._id}, { "$pull": { "friendrequests": { "username": username } }}, { safe: true, multi:true }, function(err, obj) {}); // remove
		res.send({error:null});
	}catch(e){
		res.send({error:"deny friend broke :/"});
	}
  
  	
});

function checkIfAlreadyInFriendRequestsArray(array, username){
	for(let i = 0; i<array.length; i++ ){
		if(array[i].username == username)
			return true;
	}
	return false;
}


app.get("/acceptfriend", async function(req, res) {
	const username = req.query.user;
	try{
		
		const r1 = user.findOneAndUpdate({_id:req.user._id}, { "$pull": { "friendrequests": { "username": username } }, }, { safe: true, multi:true }, function(err, obj) {}); // remove
		const r2 = user.findOneAndUpdate({username:username}, {$addToSet: {friends : req.user}},  (err, doc)=>{}); // add 
		const r3 = await user.findOne({username:username});
		const r4 = user.findOneAndUpdate({_id:req.user._id}, {$addToSet: {friends : r3}},  (err, doc)=>{}); // add

		res.send({error:null});

	}catch(e){

		res.send({error:"accept friend broke :/"});

	}
  	
})

app.get("/removefriend", async function(req, res) {
	const username = req.query.user;
	try{
		
		const r1 = user.findOneAndUpdate({_id:req.user._id}, { "$pull": { "friends": { "username": username } } }, { safe: true, multi:true }, function(err, obj) {}); // remove
		const r2 = await user.findOneAndUpdate({username:username}, { "$pull": { "friends": { "_id": req.user._id } } }, { safe: true, multi:true }, function(err, obj) {});
		
		res.send({error:null});

	}catch(e){

		res.send({error:"remove friend broke :/"});

	}
  	
})





app.get('/mongo', async (req, res) => {
	//description:"choose different color combiniations for each class."
	//const rr = user.updateMany({level: {$exists: true}}, {$unset: {level: 4}}, {strict:false},  (err, doc)=>{}); // delete thing
	//const rr = user.updateMany({"stats.totalDamage": {$exists: true}}, {$unset: {"stats.totalDamage": ""}}, {strict:false},  (err, doc)=>{}); // delete object var 
	//const rr = user.updateMany({}, {$set: {"stats.deathCount": 0}}, {upsert:true},  (err, doc)=>{}); // add object var 
	//const rr = user.updateMany({}, {$set: {friendrequests: []}}, {upsert:true},  (err, doc)=>{}); // add empty array 
	//const rr = user.updateMany({}, {$set: {"inapppurchases.$[].description" : "select different color swatches all different classes."}}, {upsert:true, new:true},  (err, doc)=>{}); //update description on object array 
	//const rr = user.updateMany({}, {$set: {"inapppurchases.$[].description" : "select different color swatches all different classes."}}, {upsert:true, new:true},  (err, doc)=>{}); //update description on object array 
	//const rr = user.updateMany({}, {$set: {"inapppurchases.$[].skew" : "0001"}}, {upsert:true, new:true},  (err, doc)=>{}); //add element 
	//const rr = user.updateMany({}, {$set: {"inapppurchases.0.icon" : "createdlogin"}}, {upsert:true, new:true},  (err, doc)=>{}); //add element 
	
	//const rr = user.updateMany({}, {$set: {online: false, icon:"accountcreated", game:""}}, {upsert:true},  (err, doc)=>{}); // add empty array 
	
	
	//user.updateMany({},{ $set: { "inapppurchases.$[t].description": "new new new" } },{ arrayFilters: [ { "t.skew": "0001" } ], upsert:true })
	// const rr = user.updateMany({},{ $set: { "inapppurchases.1.description" : "skin by cool artist." } },{upsert:true },  (err, doc)=>{
	// 	console.log(err)
	// })

	// const newObj = {
	// 	name:"new skin", 
	// 	description:"skin by cool artist.", 
	// 	purchased:false,
	// 	skew:"0002"
	// }
	// const rr = user.updateMany({}, {$addToSet: {inapppurchases : newObj}}, {upsert:true},  (err, doc)=>{}); //add in app purchase to array 


	// const nm1 = "usr1#"+Math.floor(1000 + Math.random() * 9000);
	// const nm2 = "usr2#"+Math.floor(1000 + Math.random() * 9000);

	// const usr1 = await user.findOneAndUpdate({_id:mongoose.Types.ObjectId("6245d55951fab47db8c80c09")},{$set:{username:nm1}});
	// const usr2 = await user.findOneAndUpdate({_id:mongoose.Types.ObjectId("624921d0e4f110b86a1fc440")},{$set:{username:nm2}});
			
	//const rr = user.updateMany({}, { "$pull": { "inapppurchases": { "skew": "0002" } }}, { safe: true, multi:true }, function(err, obj) {}); // remove

	//console.log(rr); // Number of documents matched
	
	const usr1 = await user.findOne({_id:mongoose.Types.ObjectId("6245d55951fab47db8c80c09")});		
	const usr2 = await user.findOne({_id:mongoose.Types.ObjectId("624921d0e4f110b86a1fc440")});		
	
	console.log(usr1)
	console.log(usr2)

});

// app.get('/setup', async (req, res) => {
// 	const email = "vince.mckelvie@gmail.com";
// 	const usr = "vince";
// 	const pw = "1234";
// 	const exists = await user.exists({ email: email });
// 	if (exists) {
// 		res.render('index.ejs',{user:null, error:{signuperror:"Admin already exits."}})		
// 		return;
// 	};
// 	bcrypt.genSalt(10, function (err, salt) {
// 		if (err) return next(err);
// 		bcrypt.hash(pw, salt, function (err, hash) {
// 			if (err) return next(err);
			
// 			const newAdmin = new user({
// 				email: email,
// 				username:usr,
// 				password: hash,
// 				inapppurchases:{},
// 				friends:{},
// 				stats:{},
// 				xp:0,
// 				level:0,
// 				bux:0
// 			});
// 			newAdmin.save();
// 			res.render('index.ejs',{user:null, error:{signuperror:"Admin created."}})
// 		});
// 	});
// });

app.listen(3005, ()=>{console.log("listening on 3005")});