const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html')
//to sanitize html to prevent xss
const extension = (joi)=>({
    type:'string',
    base: joi.string(),
    messages : {
        'string.escapeHTML':'{{#label}} must not include HTML!'
    },
    rules:{
        escapeHTML : {
            validate(value,helpers){
            const clean = sanitizeHtml(value, {
                allowedTags: [],
                allowedAttributes: {},
                  
                });
                if(clean !== value) return helpers.error('string.escapeHTML',{value})
                    return clean;
        }
    }
}
});

const Joi = BaseJoi.extend(extension)

module.exports.joiCampgroundSchema = Joi.object({
    campground: Joi.object({
        //req.body should contain a nested object campground which comes from the name property of ejs file
        title : Joi.string().required().escapeHTML(),
        price : Joi.number().required().min(0),
        // image : Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()

    }).required(),
    deleteImages : Joi.array()

    
})

module.exports.joiReviewSchema = Joi.object({

    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        body : Joi.string().required().escapeHTML()
    }).required()

})