//instead of repeating ourselves and creating a statusCode and message in every function 
//we create a class to use in all our app to handle errors for us 

class AppError extends Error {
   constructor(message, statusCode){
       super(message);
       this.statusCode = statusCode;
       this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
       this.isOperational = true;

       Error.captureStackTrace(this, this.constructor)
   }
}

module.exports = AppError;