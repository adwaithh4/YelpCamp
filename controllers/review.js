const Review = require('../models/review')
const Campground = require('../models/campground');

module.exports.createReview = async (req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created a new review');
    res.redirect(`/campgrounds/${campground._id}`);

}

module.exports.deleteReview = async(req,res,next) => {
    const { id } = req.params;
    const { reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id,{ $pull:{ reviews: reviewId}});
    req.flash('success','Review Successfullly Deleted');
    res.redirect(`/campgrounds/${id}`);
    
    
} 