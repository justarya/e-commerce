const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  hashPassword(password){
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  },
  comparePassword(password,hash){
    return bcrypt.compareSync(password, hash);
  }
}