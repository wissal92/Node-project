const AppError = require('../utils/appError');

const handleCastErrorDB = err  => {
   const msg = `Invalid ${err.path}: ${err.value}.`;
   return new AppError(msg, 400);
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; //=> to match just the text inside quotes which is our name 
    const msg = `Duplicate fields value: ${value} please use another value!`;
    return new AppError(msg, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const msg = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(msg, 400);
}

const sendErrorDev = (err, res) =>{
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        err: err,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    //Operational, trusted error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({ 
            status: err.status, 
            message: err.message
        });

    //Programming or other unknown error: don't leak error  details
   } else {
       //1) Log error
       console.log('ERROR 💥', err);
       
       //2)send generic message
       res.status(500).json({
           status: 'error',
           message: 'Somthing went wrong :('
       })
   }
}

module.exports = (err, req, res, next) => {
    //console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if(process.env.NODE_ENV === 'development'){ //=> in development we want to get as much info as we can inlike in production 
        sendErrorDev(err, res);       
    } else if(process.env.NODE_ENV === 'production') { // => in production we only want the status and msg
        //handling invalid database errors by transforming the errors that we get from mongoose into an operational error with a friendly msg
        let error = {...err};

        if(error.name === 'CastError') error = handleCastErrorDB(error);

        //handle duplicate names error: 
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        
        //handle validation errors: 
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        
       sendErrorProd(error, res);
    }
}


