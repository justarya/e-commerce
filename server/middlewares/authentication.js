const jwt = require('../helpers/jwt');

module.exports = function(req,res,next){
  if(req.headers.access_token && req.headers.access_token !== '[object Object]'){
    let decode = jwt.decodeToken(req.headers.access_token);
    req.decode = decode;
    next();
  }else{
    next({httpStatus: 401, message:"User need login"});
  }
}