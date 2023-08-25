const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'please provide product name'],
        trim : true,
        maxlength : [120, 'Product name should not be more than 120 characters']
    },

    price : {
        type : Number,
        required : [true, 'please provide product price'],
        maxlength : [6, 'Product price should not be more than 6 digits']
    },

    description : {
        type : String,
        required : [true, 'please provide product description'],
    },

    // this time we will get array of photos as the product will many photos
    photos :[
        {
            id : {
                type : String,
                required : true
            },
            secure_url : {
                type : String,
                required : true
            },
        }
    ],

    category : {
        type : String,
        required : [true, 'please select category from-short-sleeves, long-sleeves, sweat-shirts, hoodies'],
        enum : {
            values :[
                // not to put unneccessary - in between as it may be url encoded further and error might occur.
                'shortsleeves',
                'longsleeves',
                'sweatshirts',
                'hoodies',
            ],
            message : 'Please select category ONLY from-short-sleeves, long-sleeves, sweat-shirts, hoodies'
        },
    },

    stock : {
        type : Number,
        required : [true,'Please add a number in stock'],
    },

    brand : {
        type : String,
        required : [true, 'please add a brand for clothing'],
    },

    ratings : {
        type : Number,
        default : 0
    },

    numberOfReviews : {
        type : Number,
        default : 0
    },

    reviews : [
        {
            user : { 
                type : mongoose.Schema.ObjectId, // this objectid is what that is stored in mongoDb as objectid first feild.
                ref : 'User' ,// we are using User model here so call it here same as what u called it at exporting time(i.e User)
                required : true,
            },
            name : {
                type : String,
                required : true,
            },
            rating : {
                type : Number,
                required : true,
            },
            comment : {
                type : String,
                required : true,
            },
        }
    ],

    user : {
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required : true,
    },

    createdAt :{
        type : Date,
        default : Date.now,
    }
    
})


module.exports = mongoose.model('Product',productSchema)