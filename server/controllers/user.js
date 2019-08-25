const Model = require('../models');
const bcrypt = require('../helpers/bcrypt')
const jwt = require('../helpers/jwt');

class User {
  static login(req,res,next){
    if(!req.body.email || !req.body.password) next({httpStatus: 406, message: 'Email/Password is required'})
    Model.User
      .findOne({
        email: req.body.email
      })
      .then(data => {
        if(!data) next({httpStatus: 403, message: 'Email/Password is wrong'})
        else{
          if(bcrypt.comparePassword(req.body.password,data.password)){
            let payload = {
              _id: data._id,
              name: data.name,
              username: data.username,
              email: data.email,
              role: 'author',
              loginWith: 'normal'
            }
            let access_token = jwt.generateToken(payload);
            res.json({access_token, payload});
          }else{
            next({httpStatus: 403, message: 'Email/Password is wrong'})
          }
        }
      })
      .catch(next)
    
  }
  static register(req,res,next){
    Model.User
      .create({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
      })
      .then(data => {
        let payload = {
          _id: data._id,
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
          loginWith: data.loginWith
        }
        let access_token = jwt.generateToken(payload);
        res.status(201).json({access_token, payload});
      })
      .catch(next)
  }
  static getUser(req,res,next){
    Model.User
      .findOne({
        _id: req.decode._id
      })
      .then(data => {
        if(data){
          res.json(data);
        }else{
          next({httpStatus: 403, message: 'Forbidden'})
        }
      })
      .catch(next)
  }
}

module.exports = User;