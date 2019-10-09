          //************** EXPRESS CODE  *******************/

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//this middleware gives us access to data of the body without it req.body would not work
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
})

app.use((req, res, next) => {
    req.requestTime= new Date().toISOString();
    next();
})

//morgan is a middleware that allow us to log request data in the console
app.use(morgan('dev'))

//this is where we mount ou routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


module.exports = app;