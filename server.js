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



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
