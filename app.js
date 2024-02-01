const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;


mongoose.connect('mongodb://127.0.0.1:27017/its')
  .then(() => console.log('Connected!'));

var models = require('./model/models')(mongoose)

var indexRouter = require('./routes/index');
mongoose.Promise =  global.Promise;
app.use( function( req, res ,next){
  req.nosql = mongoose;
  global.nosql = req.nosql;
  next();
})
app.use('/', indexRouter);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
