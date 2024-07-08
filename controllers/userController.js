const User = require('../models/user') // convetion is that u should always bring this models as an uppercase first letter like here User
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary')
const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')

exports.signup = BigPromise(async (req,res,next) =>{


    const {name,email,password} = req.body


    if(!email || !name || !password){
        return next(new CustomError('Name, email, password are required',400)) 
        // return next(new Error('Please send email')) // this is an default error class which does not accept code just a message.
    }


    if(!req.files){
       return next(new CustomError('photo is required for signup',400)) 
    }


    let file = req.files.photo // make sure in frontend to name it as photo only
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
        folder : "users", // make it first on cloudinary also.
        width : 150,
        crop : "scale"
    })


    const user = await User.create({
        name,
        email,
        password,
        photo : {
            id : result.public_id,
            secure_url : result.secure_url
        }
    })

    
    cookieToken(user,res);
});


exports.login = BigPromise(async (req,res,next) => {
    const {email, password} = req.body

    // check for presence of email and password
    if(!email || !password){
        return next(new CustomError('please provide email and password',400))
    }

    // getting user from DB
    const user = await User.findOne({email}).select("+password") // we have to write select +password becuase in model we set default select as false for password but we need it here to verify if entered password is same or not.

    // if user not found in DB
    if(!user){
        return next(new CustomError('Email or password does not match or exist',400))
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password)

    // if password do not match
    if(!isPasswordCorrect){
        return next(new CustomError('Email or password does not match or exist',400))
    }

    // if all goes good then we send token
    cookieToken(user,res);

})


exports.logout = BigPromise(async (req,res,next) => {

// JWT Token are stateless they dont care who you are everyone can login if they have the token.
// therefore we need to delete token. and also from frontend side make sure to delete token from local storage or anwhere similar.

// since we send the token in cookie now we will delete it.
    res.cookie('token',null,{
        expires : new Date(Date.now()),
        httpOnly : true
    })

    res.status(200).json({
        success : true,
        message : "Logout success",
    })

})


exports.forgotPassword = BigPromise(async (req,res,next) => {

    const {email} = req.body

    const user = await User.findOne({email})

    // if user not found in db
    if(!user){
        return next(new CustomError('Email not found as registered', 400))
    }

    // get token from uset model methods
    const forgotToken = user.getForgotPasswordToken()
    // const forgotToken = await user.getForgotPasswordToken()


    // note that in model user we did not save forgotPasswordExpiry in to db because we need to do it here where needed.
    // save feilds in db
    await user.save({validateBeforeSave : false})//this is required because some of the time the db is designed in such way that all the feilds are required while saving therefore this is used to let it know to just anyhow save it 

    // now we want to send forgotToken to user and thus we need to craft an url for that 
    // create url
    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

    // now our url is ready and we will send this is url to user via email.
    // craft message
    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`

    // mail sending part (TRICKY so use try catch and catch is very impportant here)
    // attempt to send mail
    try {
        await mailHelper({
            email : user.email,
            subject :"Tshirt-Store password reset mail",
            message,
        })

        // json response if all goes well
        res.status(200).json({
            success : true,
            message : "Email sent successfully",
        })
    } catch (error) {
        // we need to flush out below two feilds because whenn user  comes again his this feilds shoulld be empty
        user.forgotPasswordToken = undefined
        user.forgotPasswordExpiry = undefined

        // now we save them in db also
        await user.save({validateBeforeSave : false})

        return next(new CustomError(error.message, 500))
    }

})


exports.passwordReset = BigPromise(async (req,res,next) => {

    
    const token = req.params.token

    const encryToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
        forgotPasswordToken: encryToken,
        forgotPasswordExpiry : {$gt : Date.now()} // monngodb query to look for expiry that is in future and not in past. gt = greater than.
    })
    
    if(!user){
        return next(new CustomError('Token is invalid or is expired',400))
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new CustomError('Password and confirm password do not match',400))
    }

    user.password = req.body.password

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    // send a JSON response or send token

    cookieToken(user,res)
})


exports.getLoggedInUserDetails = BigPromise(async (req,res,next) => {

    const user = await User.findById(req.user.id) //note req.user does not exist we have added it recently in middleware of isLoggedIn.
    res.status(200).json({
        success : true,
        user,
    })
})


exports.changePassword = BigPromise(async (req,res,next) => {

    const userId = req.user.id // because this should be only accessed when user is logged in and req.user is coming from middleware
    const user = await User.findById(userId).select("+password")

    const isCorrectPassword = await user.isValidatedPassword(req.body.oldPassword)
    if(!isCorrectPassword) {
        return next(new CustomError('Old password is incorrect',400))
    }

    user.password = req.body.password
    await user.save()

    cookieToken(user,res)
})


exports.updateUserDetails = BigPromise(async (req,res,next) => {

    // the way we will use is that we will give all the values to user on the frontend and then whatever he wishes to change will change.
    // Because we need all information on backend side to update all at once. except password that is taken care of in another route.

    // add a check so that there is email and name received in req.body
    const newData = {
        name : req.body.name,
        email : req.body.email
    }
    // now name and email is taken care of remainig is photo. Tricky part
    if(req.files){
        // if the photo is there first we need to find its id then delete it from cloudinary
        const user = await User.findById(req.user.id)
        const imageId = user.photo.id
        // deleting from cloudinary it takes id as a parameter and not even the path it destroys it.
        const resp = await cloudinary.v2.uploader.destroy(imageId)

        // uploading new photo now
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath,{
            folder : "users", // make it first on cloudinary also.
            width : 150,
            crop : "scale"
        });

        newData.photo ={
            id : result.public_id,
            secure_url : result.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id ,newData ,{ // i can extract the id anywhere thanks to the middleware.
        new : true,
        runValidators : true,
        // useFindAndModify : false
        useFindAndModify : false
    }) 

    res.status(200).json({
        success : true,

    })
})

exports.adminAllUser = BigPromise(async (req,res,next) => {
    const users = await User.find()

    res.status(200).json({
        success : true,
        users,
    })
})


exports.admingetOneUser = BigPromise(async (req,res,next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new CustomError('No user found',400));
    }

    res.status(200).json({
        success : true,
        user,
    })
})


exports.adminUpdateOneUserDetails = BigPromise(async (req,res,next) => {

    const newData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }
    
    const user = await User.findByIdAndUpdate(req.params.id ,newData ,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    }) 

    res.status(200).json({
        success : true,
    })
})


exports.adminDeleteOneUser = BigPromise(async (req,res,next) => {

   const user = await User.findById(req.params.id)
   
   if(!user){
    return next(new CustomError('No such User Found',401))
   }
   
//    first we will delte photo and not details because we need user details to dlete the photo from cloudinary
   if(req.files){
        const imageId = user.photo.id
  
        await cloudinary.v2.uploader.destroy(imageId)
   }
   
   await user.deleteOne()

   res.status(200).json({
        success : true,
   })

})








exports.managerAllUser = BigPromise(async (req,res,next) => {
    const users = await User.find({role :'user'})

    res.status(200).json({
        success : true,
        users,
    })
})

