         //******************* SERVER CODE **********************/
const dotenv = require('dotenv');
//this command will read our variables from config file then save them
//to nodejs environment variables so we can use them in whatever file we want in ou app
dotenv.config({path: './config.env'});

const app = require('./app');


//console.log(process.env);

//so we can use the port creared in our config file or 3000
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