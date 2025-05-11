if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose =  require('mongoose');
const session = require('express-session')
const flash = require('connect-flash')

const MethodOverride=require('method-override');
const catchAsync =  require('./utility/catchAsync');
const ExpressError = require('./utility/ExpressError');
const Joi = require('joi');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const helmet = require('helmet');
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
const MongoDBStore = require('connect-mongo')(session);


const mongoSanitize = require('express-mongo-sanitize');

 
const campgroundRoutes = require("./routes/campground")
const reviewRoutes = require("./routes/reviews")
const userRoutes = require("./routes/users")
 
const User = require("./models/user")

mongoose.connect(dbUrl)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("Connected to MongoDB Atlas"))
// .catch(err => console.error("MongoDB connection error:", err));



app.set('view engine','ejs')
app.engine('ejs',ejsMate)
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
//to parse the request body
app.use(MethodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(flash());
app.use(mongoSanitize())


const secret = process.env.SECRET || '12345';
const store = new MongoDBStore({
    url: dbUrl,
    touchAfter: 24 * 60 * 60,
    // how often a session should be updated
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)        
})

const sessionConfig = {
    store,
    name : 'session',
    secret : secret,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly : true
        // ,secure:true
    }

}


app.use(session(sessionConfig))
app.use(helmet())


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/css2/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
    
];



const fontSrcUrls = [
    "https://fonts.googleapis.com/css2/",
    "https://fonts.gstatic.com/s/"
    

];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dyrpryw0v/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'",...fontSrcUrls ],
        },
    })
);



app.use(passport.initialize());
//initialize passport before using it
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//specifying the authentication method in the local strategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//how to store and unstore user in the session

const validateCampground = (req,res,next)=>{
   
    // passing data to the schema for validating
    const{error}= joiCampgroundSchema.validate(req.body);
    //this will return value,error,details if any occurs,so we destructure the error part from it
    if(error){
        console.dir(error)
        //through this you can see the details property
        const msg = error.details.map(el=> el.message).join(',')
        // as normally error.details would have returned an array of messages which is not readable so we map through
        //each messages and join it together as a string seperated by ","
        throw new ExpressError(msg,400)

    }else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} = joiReviewSchema.validate(req.body);
    if(error){
        console.dir(error)
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg,400)

    }else{
        next();
    }

}

//make sure its above all the route handlers
//defining a middleware so that the flash message is accessible to
//all the templates so that we dont have to pass req.flash(key) on every template
//for every req we setup response objecct with these globbal variables
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})
// so we can access the value of the flash by just refernecing the key in template files



app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.use('/',userRoutes)

//all the routes are in this router

app.get('/',(req,res)=>{
    res.render('home');
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError("Page Not Found",404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err});

})
const port = process.env.PORT || 8085;
app.listen(port,()=>{
    console.log(`Serving on port ${port}`)
})