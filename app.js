          //************** EXPRESS CODE  *******************/

const express = require('express');
const morgan = require('morgan');
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

//error handler middlware if we reached it that means that it did not get handled
//by other router(route does not match any defined one).
app.all('*', (req, res, next) => { //=> all : stands for all the verbes instead of defining error handler for each one and the * stand for all urls
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    })
})

module.exports = app;

