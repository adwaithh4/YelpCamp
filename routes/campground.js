const express = require('express');
const router = express.Router();
const catchAsync =  require('../utility/catchAsync');
const ExpressError = require('../utility/ExpressError');
const Campground = require('../models/campground');
const {joiCampgroundSchema , joiReviewSchema }=require('../schemas');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const campground = require('../controllers/campground')
const multer = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({storage});
//**normal way**/
// router.get('/',catchAsync(campground.index))
// router.post('/', isLoggedIn,validateCampground,catchAsync(campground.showCampground))

//**fancy way**//
router.route('/')
    .get(catchAsync(campground.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campground.createCampground))
    //upload.array is the mutter middleware for fileupload 


router.get('/new',isLoggedIn,campground.renderNewForm)

router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .post(isLoggedIn,validateCampground,catchAsync(campground.deleteCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campground.updateCampground))

 


router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campground.renderEditForm))

router.post('/:id/delete',isLoggedIn,isAuthor,catchAsync(campground.deleteCampground))

module.exports = router;