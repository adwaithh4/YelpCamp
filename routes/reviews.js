const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync =  require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const { joiReviewSchema }=require('../schemas');
const Review = require('../models/review')
const Campground = require('../models/campground');
const{validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const review = require('../controllers/review')


router.post('/' ,isLoggedIn,validateReview ,catchAsync(review.createReview))

router.post('/:reviewId/delete', isLoggedIn,isReviewAuthor,catchAsync(review.deleteReview))

module.exports = router;