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
  .then(con => console.log('DB connection successful :)'))
  .catch(err => console.log('DB connection failed :('))

//*******************************/
//        OUR SCHEMAS
//*******************************/

//when creating schema we could give our parameters a value as the data type
//or an object if we want more features

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], //=> we can pass an array if we want to display an error when this field is missing we call it a validator  
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required:[true, 'A tour must have a price'],
  }
});

//*********************************/
//        OUR MODELS
//*********************************/

//After creating our schemas we can create our models out of it:
// => A model is like a blueprint that we use to create documents

const Tour = mongoose.model('Tour', tourSchema);


//********************************/
//       OUR DOCUMENTS            
//********************************/

//We create them out of our models:

const testTour = new Tour({
  name: 'The Park Camper',
  price: 876
});

//and to save in our Tour collection in our database we use: 
testTour.save().then(doc => console.log(doc))
               .catch(err => console.log('Error 😢: ', err));
              


//**************************************************************************
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});


//************************** USEFUL INFOS ********************/

//+) => BY DEFAULT EXPRESS SETS THE ENVIRONMENT TO DEVELOPMENT

//+) => ENVIRONMENT VARIABLES ARE GLOBALE VARIABLES THAT ARE USED TO DEFINE 
//THE ENVIRONMENT IN WHICH A NODE APP IS RUNNING

//)+) => WHENEVER OUR APP NEEDS SOME CONFIGURATION FOR STUFF THAT MIGHT CHANGE BASED
//ON THE ENVIRONMENT THAT THE APP IS RUNNING IN, WE USE ENVIRONMENT VARIABLES

//)+) => INSTEAD OF WRITING OUR ENVIRONMENT VARIABLES IN THE TERMINAL WE CREATE
//A CONFIG FILE TO PUT THEM THERE

//+) => AFTER CREATING THE FILE TO CONNECTED WITH OUR NODE APP WE USE dotenv
//Package then require it in our server file then call config method on it 
//with passing the path to our config file as argument

//+)AND KNOW WE CAN GET OUR DEFINED VARIABLES FROM  PROCESS.ENV 
//EX => process.env.name will give us wissal