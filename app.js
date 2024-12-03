require('dotenv').config();

const express = require('express');
const router = express.Router({mergeParams : true});
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema , reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{console.log('db connected')}).catch((err)=>{console.log(err)});

async function main() {
    await mongoose.connect(dbUrl);
};

const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');
const user = require('./models/user.js');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err) => {
    console.log('error in mongo session store',err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

// app.get('/',(req,res)=>{
//     res.send('<h1>Hii I AM ROOT</h1>')
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


//page not found error 
 app.all('*',(req,res,next) => {
    const error = new ExpressError(404,'Page not found');
    next(error);
 })

//error middleware 
app.use((err,req,res,next) => {
    let {status = 500,message = "some error occured"} = err;
    if(err.status == 404){
        res.render('notFound.ejs');
    } else {
        res.status(status).send(message);
    }
});

app.use((req, res, next) => {
    res.render('notFound.ejs');
});

app.listen(3000, () => {
    console.log('server is running on port 3000...');
});
