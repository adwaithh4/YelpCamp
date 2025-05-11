const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync =  require('../utility/catchAsync');
const passport = require('passport')
const { storeReturnTo} = require('../middleware');
const user = require('../controllers/user')

//**NEW**/
router.route('/register')
    .get(user.renderRegister)
    .post(catchAsync(user.register));

//**OLD**/
// router.get('/register',user.renderRegister)
// router.post('/register',catchAsync(user.register));

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo,passport.authenticate('local',{failureFlash:true, failureRedirect : '/login'}),user.login)


router.get('/logout', user.logout); 

module.exports = router;