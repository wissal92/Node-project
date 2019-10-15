const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);


//the second paramter is just an object with some options to deal with deprecation warnings
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful :)'))

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Server listening on port ' + port);
});

//how to handle unhandled rejections outside express:like failed connection to mongodb
//errors outside express will not be catched by our global error handler middleware
//so to globally handle unhandled rejected promises we add: 

process.on('unhandledRejection', err =>{
  console.log(err.name, err.message)
  //to shut down our app gracefully we start by closing the sever first the we shut down the app  
  server.close(() => { //server.close gives the server the time to finish all the requests that are still pending
    process.exit(1); // => we use it to shut down our app
  })
});

