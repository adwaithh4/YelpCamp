const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary")

const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async(req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index",{campgrounds})
}

module.exports.renderNewForm = async(req,res)=>{
    res.render("campgrounds/new")
}


module.exports.showCampground = async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    const days = Math.floor(Math.random()*20)+1
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    
    res.render("campgrounds/show",{campground , days})
}

module.exports.createCampground = async(req,res,next)=>{
        
        console.log(req.body)
        // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
        const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
        const campground = new Campground(req.body.campground);
        campground.geometry = geoData.features[0].geometry;
        console.log(campground.geometry);
        campground.images = req.files.map(f => ({ url: f.path, filename: f.filename}))
        campground.author = req.user._id;
        await campground.save();
        console.log(campground)
        req.flash('success','Successfully made a new campground')
        res.redirect(`/campgrounds/${campground._id}`)
    
    
    }

module.exports.renderEditForm = async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit",{campground})
}    

module.exports.updateCampground = async(req,res,next)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{new:true}) //the ... is spread operator to create new object rather than affecting any change to req.body itself
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}))
    campground.images.push(...imgs)  //we used push not to overwrite all images
    //... is added to prevent nested array, here only taking data from array and pushing
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
       await campground.updateOne({$pull:{images : { filename :{ $in : req.body.deleteImages}}}})
       
    }
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req,res,next)=>{
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id)
    req.flash('success','Campground Successfullly Deleted');
    res.redirect('/campgrounds')

}