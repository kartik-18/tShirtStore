const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError');
const Jwt = require('jsonwebtoken')


exports.isLoggedIn = BigPromise(async (req,res,next) => {
    const token = req.cookies.token || req.header("Authorization").replace('Bearer ',"");

    if(!token) {return next(new CustomError('Login first to access this page', 401))}

    const decoded = Jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next();
})


//below here we are accepting it as array whereas it only consists of single value. But to get methods associated with array we will makeitarray

exports.customRole = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)){
            // since we are using this middleware after isLoggedIn middeware we have req.user... Now from req.user.role we will be checking its role from database and then we will match it with what we have got in roles array which is basically a string but to use the includes method we have spread it or have accepted it as an array

            return next(new CustomError('You are not allowed for this resource',403))
        }

        next()
    }


}