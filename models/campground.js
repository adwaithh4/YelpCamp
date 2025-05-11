const mongoose = require('mongoose');
// const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
// mongoose.connect(dbUrl)
// .then(() => console.log("Connected to MongoDB Atlas"))
// .catch(err => console.error("MongoDB connection error:", err));


// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("Connected to MongoDB Atlas"))
// .catch(err => console.error("MongoDB connection error:", err));

const Reviews = require('./review');
const { required } = require('joi');
const Schema = mongoose.Schema;

const ImageSchema =  new Schema({
        url : String,
        filename : String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
ImageSchema.virtual("cardImage").get(function () {
    return this.url.replace("/upload", "/upload/ar_5:3,c_crop");
  }); 

const opts = { toJSON: { virtuals: true}};

const CampgroundSchema =  new Schema({
    title: String,
    images:[ImageSchema],
    geometry: {
        type: {
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type:[Number],
            required:true
        }
    },
    price:Number,
    description: String,
    location: String,
    author:{
            type: Schema.Types.ObjectId,
            ref:'User'
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts)

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description}.<p>`
});
CampgroundSchema.post('findOneAndDelete',async function(doc) {
    if(doc){
         await Reviews.deleteMany({_id:{$in:doc.reviews}})
       
    }

})

module.exports = mongoose.model('Campground',CampgroundSchema) 