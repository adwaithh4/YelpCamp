const User = require('../models/user');

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res)=>{
    try{
        const{username,password,email}= req.body;
        const user=  new User({email,username});
        const registeredUser = await User.register(user,password);
        // register is a mongoose method ie related to saving or registering the data to db
        console.log(registeredUser);
        req.login(registeredUser,err=>{
            if(err)return next(err);
            req.flash('success','Welcome to Yelp Camp');
             res.redirect('/campgrounds');
        
        })
        
    } catch(e) {
        req.flash('error',e.message);
        res.redirect('register');
    }
    
}

module.exports.renderLogin =(req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    //but authenticate is a  passport specific middleware which serve the purpose of authenticating not saving the credentials unlike register method
    //thats why we use passport.authenticate
    req.flash('success','welcome back')
    const redirectUrl = res.locals.returnTo;
    if(!redirectUrl){
        return res.redirect('/campgrounds')
    }
    //added code
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}