          //************** EXPRESS CODE  *******************/

const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const GlobaErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//this middleware gives us access to data of the body without it req.body would not work
app.use(express.json());

//MORGAN middleware logs requested data in the console:
//we add this if statement to only use morgan if we are in development mode:
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development'){
   app.use(morgan('dev'));
}

//this middleware serves static files like our html templates and our images from a folder without using a route
app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    req.requestTime= new Date().toISOString();
    next();
})


//this is where we mount ou routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//error handler middleware:
app.all('*', (req, res, next) => { //=> all : stands for all the verbes instead of defining error handler for each one and the * stand for all urls
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//global error handler middleware: instead of error handling in each route we create a global error handler
//to define an error handler middleware function => we give it 4 arguments instead of three whenever
//express sees a middleware with 4 arguments it will only call it when there is an error
app.use(GlobaErrorHandler);

module.exports = app;

