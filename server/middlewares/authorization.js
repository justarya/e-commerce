const Model = require('../models');
module.exports = {
  product(req,res,next){
    Model.Product
      .findOne({
        _id: req.params.id,
        sellerId: req.decode._id,
      })
      .then(data => {
        if(data) next();
        else next({httpStatus: 401, message:"Unauthorized access"})
      })
  },

  cart(req,res,next){
    // console.log(req.params.id,req.decode._id)
    Model.Cart
      .findOne({
        _id: req.params.id
      })
      .then(data => {
        // console.log('userId',data.userId, '===' ,String(req.decode._id),String(data.userId) === String(req.decode._id))
        if(!data) next({httpStatus: 404, message: 'Cart not found'});
        else if(String(data.userId) !== String(req.decode._id)) next({httpStatus: 401, message:"Unauthorized access"})        
        else next();
      })
  }
}