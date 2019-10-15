//in order to git rid of try catch blocks we just create a function and wrap
//our async function by it => which will return a new anonymous function which will
//be assigned to the function that want to romove try catch from it

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); //=> this catch will send the error to our global error handling middleware
    };
};