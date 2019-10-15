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
app.all('*', (req, res, next) => { 
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobaErrorHandler);

module.exports = app;

