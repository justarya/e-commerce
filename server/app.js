if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ){
  require('dotenv').config();
}
const express = require('express');
const app = express();
const port = process.env.PORT;
const routes = require('./routes');
const cors = require('cors');
const mongoose = require('mongoose');

const mode = process.env.NODE_ENV || 'hacktiv8'

mongoose.connect('mongodb://localhost:27017/task_ecommerce_'+mode, {useNewUrlParser: true})
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log('Error Connecting to database | Error:'+err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use('/api/user',routes.user);
app.use('/api/products',routes.product);
app.use('/api/cart',routes.cart);


app.use('/',(req,res,next) => next({httpStatus:404,message:'url not found'}));

app.use(function(err,req,res,next){
  let messages;
  let httpStatus;
  if(err.name === 'ValidationError'){
    httpStatus = 403
    messages = Object.keys(err.errors).map((el) => err.errors[el].message);
  }

  console.log(messages || err.message || err || 'Internal Server Error');
  console.log(httpStatus || err.httpStatus || 500)
  
  res.status(httpStatus || err.httpStatus || 500)
    .json({error: messages || err.message || err || 'Internal Server Error'});
})

app.listen(port, () => console.log('Server is started with PORT:'+port));

module.exports = app;