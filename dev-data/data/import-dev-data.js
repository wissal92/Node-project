const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({path: './config.env'});


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

  //Read our JSON file: 

  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

  //then import the data to our database:

  const importData = async () => {
      try{
          await Tour.create(tours);
          console.log('Data successfully loaded');
      } catch(err){
          console.log(err);
      }
      process.exit();
  };

  //Delete All data from the database so that we could use the imported one instead

  const deleteData = async () =>{
      try {
          await Tour.deleteMany();
          console.log('Data successfully deleted!');
      } catch(err){
          console.log(err);
      }
      process.exit();
  };

  if(process.argv[2] === '--import'){
      importData();
  } else if(process.argv[2] === '--delete'){
      deleteData();
  }

