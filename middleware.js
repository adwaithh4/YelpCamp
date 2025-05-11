const {joiCampgroundSchema , joiReviewSchema } = require('./schemas');
const ExpressError = require('./utility/ExpressError');
//for validatecampground
const Campground = require('./models/campground');
const Review = require('./models/review');
module.exports.isLoggedIn = (req,res,next)=> {
    if(!req.isAuthenticated()){

        req.session.returnTo = req.originalUrl;
        //to redirect back to what the user was actually requesting before getting authenticated
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');

    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCampground = (req,res,next)=>{
   
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


module.exports.validateReview = (req,res,next)=>{
    const {error} = joiReviewSchema.validate(req.body);
    if(error){
        console.dir(error)
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg,400)

    }else{
        next();
    }

}

module.exports.isAuthor = async(req,res,next)=>{
    const{id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    const{ id,reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}