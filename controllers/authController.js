const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken')

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password, 
        passwordConfirm: req.body.passwordConfirm
    });

    //JSON WEB TOKENS(JWT) => are a stateless solution for authentication, we dont need to store sessions state on the server 
    //(restful api should always be stateless) how JWT works:
    //when the user post his username and email to be authenticated => the app checks if user && password exist in our server 
    //=> a unique JWT is created for each user => this JWT will be send to the client which will store it either in a cookie or local storage
    //=>now our user is authenticated without leaving any state on the server(JWT will not be saved on the server)
    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN  // =>we add it as a securety mesure to log out the user after certain period of time
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});