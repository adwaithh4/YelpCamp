const mongoose =  require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors}= require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(()=>{
    console.log("Success");
})
    .catch((err)=>{
    console.log("error");
}) 

const sample = (array)=>{
    return array[Math.floor(Math.random()*array.length)];
    

}
const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i = 0;i<88 ; i++){
        let rand = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            location:`${cities[rand].city}, ${cities[rand].state} `,
            title : `${sample(descriptors)} ${sample(places)} `,
            // image: `https://picsum.photos/400?random=${Math.random()}`,
            description:"Nestled in the heart of nature, our campground offers a peaceful retreat surrounded by towering trees, scenic trails, and a sparkling lake. Whether you're pitching a tent, parking your RV, or staying in a cozy cabin, you'll enjoy the fresh air, campfire nights, and endless outdoor adventures.",
            price,
            geometry: {
              type: "Point",
              coordinates:[
                cities[rand].longitude,
                cities[rand].latitude
              ]
            },
            //your user id
            author : '67b733e95207448dd2d5c443',
            images :   [
              {
                url: 'https://res.cloudinary.com/dyrpryw0v/image/upload/v1740159718/YelpCamp/ag4a6e3v9kses2perpu3.avif',
                filename: 'YelpCamp/ag4a6e3v9kses2perpu3' 
              },

              {
                url: 'https://res.cloudinary.com/dyrpryw0v/image/upload/v1740159718/YelpCamp/bl6lrviw0i5lqfataalz.jpg',
                filename: 'YelpCamp/bl6lrviw0i5lqfataalz',
              },

              {
                url: 'https://res.cloudinary.com/dyrpryw0v/image/upload/v1740159719/YelpCamp/hp1bbpaccqqpelrhaq3l.jpg',
                filename: 'YelpCamp/hp1bbpaccqqpelrhaq3l',
              }
            ]
          
        })
        await camp.save();
        }

}
seedDB().then(()=>{
    mongoose.connection.close();
})