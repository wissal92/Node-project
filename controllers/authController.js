//it is a built-in promisify function
const {promisify} = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

//Create A Json Web Token: 
const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
       expiresIn: process.env.JWT_EXPIRES_IN 
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, 
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });
    
    //create our token:
    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    //1)check if email and password exist
     if(!email || !password){
        return  next(new AppError('Please provide email and password!', 400))
     }

    //2)check if user exists && password is correct
     const user = await User.findOne({email}).select('+password'); //=>because we have deselected password from our fields in our schema so that it will not get sent to the client to use it a gain we need to use select with +

     //correctPassword is defined on userModel:
        if(!user || !(await user.correctPassword(password, user.password))) {
          return next(new AppError('Incorrect email or password', 401))
     }
    //3)if eveything ok, send token to client
    const token = signToken(user._id); 
    res.status(200).json({
        status: 'success',
        token
    });
});

//this middleware will check if the user is authenticated before accessing the route 
exports.protect = catchAsync(async (req, res, next) => {
    //1) Getting token and check if it is there (we usually send our token using an http header with the request)
    //the token is in authorization property inside our header and sould start with Bearer 
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[2]
    }

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    //2)Token Verification => by verifying if the signature is valid and that would tell us if the token is valid or not
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3)Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError('The token belonging to this user does no longer exist.', 401));
    }

    //4)Check if user changed password after the token was issued
    if(currentUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }
    
    //Grant access to protected route
    req.user = currentUser;
    next();

})

//with middlewares we cannot pass arguments so if we need to use them => we create a wrapper function which will return the middleware function 
//that we need with access to arguments(closure)
exports.restrictTo = (...roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};