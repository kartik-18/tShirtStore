const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'Please provide a name'],
        maxlength : [40,'Name should be under 40 charcaters']
    },
    
    email : {
        type : String,
        required : [true , 'Please provide an email'],
        validate : [validator.isEmail, 'Please enter valid email.'],
        unique : true
    },

    password : {
        type : String,
        required : [true , 'Please provide an password'],
        minlength : [6, 'password should be atleast 6 char'],
        select : false // this is used because whenever we bring the user we would not get password. for that we need to explicitly code for gettting password
    },

    role : {
        type : String,
        default : 'user'
    },

    photo : {
        id:{
            type : String,
            required : true
        },
        secure_url:{
            type : String,
            required : true
        }
    },

    forgotPasswordToken : String,

    forgotPasswordExpiry : Date,

    createdAt:{
        type : Date,
        default : Date.now, // please dont write here Date.now() like this because we want to run it when we call it not now.
    }
})

// encrypt password before save :- HOOKS (pre , post)

userSchema.pre('save',async function(next){

    // why did we use isModified and not isInit or isNew (this are provided by mongoose we can go in documentation and read about that.) because we also need to encrypt password whenever forgot password is done and we receive a fresh clean text format password.

    if(!this.isModified('password')) return next(); // if password feild is not modified keep doing whatever we were doing.
    // otherwise we go and below encrypt it.

    this.password = await bcrypt.hash(this.password , 10)
})

// validate password with passed on user password
userSchema.methods.isValidatedPassword = async function(usersendPassword){
   return await  bcrypt.compare(usersendPassword,this.password)
};

// create and return JWT token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRY,
    }) ;//this._id is given by mongoose itself whenever we create a new user. and note that it is not a json it is bson.
};

// generate forgot password token (in case of forgot password it is just a string not token but we anyhow call it token.)
userSchema.methods.getForgotPasswordToken = function(){
    // generate a long and random string (we can use nano id to generate random string)
    const forgotToken = crypto.randomBytes(20).toString('hex'); //genreated random string

    // this.forgotPasswordToken = forgotToken //we can use like this also directly but to make it more secure we even hash the crypto by sha256 algorithm or any other 
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex')
    
    // time of token
    this.forgotPasswordExpiry = Date.now() + 200 * 60 * 1000

    return forgotToken // note we dont send user forgotPasswordToken that we have hashed it used to store in databse user will get simple forgotToken.

}

module.exports = mongoose.model('User',userSchema);