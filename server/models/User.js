const mongoose = require('mongoose');
const bcrypt = require('../helpers/bcrypt')
const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    validate: [
      {
        validator: function usernameValidator(v){
          return User.findOne({username: this.username})
            .then(user => {
              return !(user && this._id !== user._id);
            })
            .catch((err) => {
              return false;
            })
        },
        message: props => `Username has already been taken` 
      }
    ]
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [
      {
        validator: function emailValidator(v){
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid email` 
      },
      {
        validator: function(v){
          return User.findOne({email: this.email})
            .then(user => {
              return !(user && this._id !== user._id);
            })
            .catch((err) => {
              return false;
            })
        },
        message: props => `Email has already been taken` 
      }
    ]
  },
  role: {
    type: String,
    default: 'customer',
  },
  loginWith: {
    type: String,
    default: 'normal'
  },
},{
  versionKey: false,
  timestamps: true,
})

userSchema.pre('save', function(){
  this.password = bcrypt.hashPassword(this.password);
});

const User = mongoose.model('User',userSchema);

module.exports = User;