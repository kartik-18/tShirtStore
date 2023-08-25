const BigPromise = require("../middlewares/bigPromise");
const CustomError = require('../utils/customError');
const cloudinary = require('cloudinary');
const Product = require('../models/product');
const WhereClaus = require("../utils/whereClaus");


exports.addProduct =  BigPromise(async (req, res,next) => {
    // images  
    // it would be many images as it is an product so we will make an array
    let imageArray = []

    if(!req.files){
        return next(new CustomError('Images are required',401));
    }

    if(req.files){
        for (let index = 0; index < req.files.photos.length; index++) { //convey frontend man we are using photos here.so that he can name it accordingly or else error will occur.

            let result =await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
                folder : 'products'
            });

            imageArray.push({
                id : result.public_id,
                secure_url : result.secure_url,
            })
        }
    }

    req.body.photos = imageArray
    req.body.user = req.user.id // this we are getting because we will first do isLoggedIn midlleware and after that we can get req.user. 

    const product = await Product.create(req.body)

    res.status(200).json({
        success : true,
        product,
    })
});

exports.getAllProduct = BigPromise(async (req,res,next) => {

    const resultperPage = 6
    // below gives total number of products
    const totalcountProduct = await Product.countDocuments()

    // below we work with WhereClaus that is defined in utility section
    const productsObj = new WhereClaus(Product.find(),req.query).search().filter();

    // below gives total number of products after the above filter
    let products = await productsObj.base
    const filteredProductNumber = products.length

    // below is the code for pagination.
    productsObj.pager(resultperPage)
    products = await productsObj.base.clone() //.clone is useed when we have to chain two or methods.

    res.status(200).json({
        success : true,
        products,
        filteredProductNumber,
        totalcountProduct,
    })

})

exports.getOneProduct = BigPromise(async (req,res,next) => {

    const product =await Product.findById(req.params.id)

    if(!product){
        return next(new CustomError('No product found with this id',401))
    }

    res.status(200).json({
        success : true,
        product,
    })

})

exports.addReview = BigPromise(async (req,res,next) => {

    const {rating, comment, productId} = req.body

    const review = { // this object will be pushed in reviews(plural) in db
        user : req.user._id,
        name : req.user.name,
        rating : Number (rating),
        comment 
    }
    const product = Product.findById(productId)

    const AlreadyReview = product.reviews.find( // boolean feild it is going in db reviews and checking wheather user has already reviewd or not.
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if(AlreadyReview){
        product.reviews.forEach((review) => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment
                review.rating = rating
            }
        });
    }else{
        product.reviews.push(review)
        product.numberOfReviews = product.reviews.length
    }


    // Now need to adjust rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc,0) / product.reviews.length

    await product.save({validateBeforeSave : false})

    res.status(200).json({
        success : true,
    })
})

exports.deleteReview = BigPromise(async (req,res,next) => {

    const { productId} = req.query

    const product =await Product.findById(productId)

    const reviews = product.reviews.filter(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    const numberOfReviews = reviews.length

    // Now need to adjust rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc,0) / product.reviews.length

    // now update product
    await Product.findByIdAndUpdate(productId,{
        reviews,
        ratings,
        numberOfReviews,
    }, {
        new : true,
        runValidators : true,
        useFindAndModify : false,
    })

    res.status(200).json({
        success : true,
    })
})


exports.getOnlyReviewsForOneProduct = BigPromise(async (req,res,next) => {

    const product = await Product.findById(req.query.id)
    
    res.status(200).json({
        success : true,
        reviews : product.reviews,
    })
})


// Admin only controllers

exports.adminGetAllProduct = BigPromise(async (req,res,next) => {

    const products = await Product.find()

    res.status(200).json({
        success : true,
        products,
    })

})

exports.adminUpdateOneProduct = BigPromise(async (req,res,next) => {

    let product = await Product.findById(req.params.id)

    if(!product){
        return next(new CustomError('No product found with this id',401))
    }

    let imagesArray =[]

    if(req.files){
        // destroy the existing images
        for(let index = 0 ; index < product.photos.length ;index++){
            const res = await cloudinary.v2.uploader.destroy(product.photos[index].id)
        }
        // upload and save the images
        for (let index = 0; index < req.files.photos.length; index++) { //convey frontend man we are using photos here.so that he can name it accordingly or else error will occur.

            let result =await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
                folder : 'products' //folder name can be go from .env file
            });

            imagesArray.push({
                id : result.public_id,
                secure_url : result.secure_url,
            })
        }
    }

    req.body.photos = imagesArray;

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new : true,
        runValidators : true,
        useFindAndModify : false,
    })

    res.status(200).json({
        success : true,
        product,
    })

})

exports.adminDeleteOneProduct = BigPromise(async (req,res,next) => {

    const product = await Product.findById(req.params.id)
    
    if(!product){
        return next(new CustomError('No product found with this id',401))
    }

    // destroy the existing images
    for(let index = 0 ; index < product.photos.length ;index++){
         await cloudinary.v2.uploader.destroy(product.photos[index].id)
    }

    await product.deleteOne()

    res.status(200).json({
        success : true,
        message : "Product was deleted!",
    })

})