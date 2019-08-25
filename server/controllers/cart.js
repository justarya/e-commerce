const Model = require('../models');

class Cart {
  static find(req,res,next){
    Model.Cart
      .find({
        userId: req.decode._id,
        status: 'hold',
      })
      .populate('productId')
      .then(data => {
        res.json(data);
      })
      .catch(next);
  }
  static create(req,res,next){
    if(!req.body.productId) next({httpStatus: 403, message: ['Product Id cannot be empty']})
    Model.Product
      .findById(req.body.productId)
      .then(data => {
        if(data.stock < 1) next({httpStatus: 403, message:'Quantity is to big'})
        else {
          return Model.Cart
            .findOne({
              productId: req.body.productId,
              status:'hold',
              userId: req.decode._id,
            })
            .populate('productId')
        }
      })
      .then((data) => {
        if(!data) {
          return Model.Cart
            .create({
              productId: req.body.productId,
              quantity: req.body.quantity,
              userId: req.decode._id,
            })
            .then(newData => {
              return Model.Cart
                .findById(newData._id)
                .populate('productId')
            })
        }else{
          if(!req.body.quantity) next({ httpStatus: 403, message: ['Quantity cannot be empty']})
          if(data.productId.stock < data.quantity + 1){
            next({httpStatus: 403, message:'Stock is not enough'})
          }else{
            return Model.Cart
              .findByIdAndUpdate(data._id,{
                $inc: {quantity: 1}
              },{new: true})
              .populate('productId')
          }
        }
      })
      .then(data => {
        res.status(201).json(data);
      })
      .catch(next);
  }
  static update(req,res,next){
    Model.Cart
      .findById(req.params.id)
      .populate('productId')
      .then(data => {
        if(data.productId.stock < req.body.quantity) next({httpStatus: 403, message:'Quantity is to big'})
        if(0 > req.body.quantity) next({httpStatus: 403, message:'Quantity is to small'})
        else{
          return Model.Cart
            .findByIdAndUpdate(req.params.id,{
              quantity: req.body.quantity,
            },{
              new: true,
              runValidators: true,
            })
            .populate('productId')
        }
      })
      .then(data => {
        if(!data) next({httpStatus: 404, message: 'Cart not found'});        
        res.json(data);
      })
      .catch(next);
  }

  static checkout(req,res,next){
    let cartData;
    Model.Cart
      .findById(req.params.id)
      .populate('productId')
      .then(data => {
        if(data.quantity <= data.productId.stock){
          return Model.Cart
            .findByIdAndUpdate(req.params.id,{
              status: 'checkout'
            },{new:true,runValidators: true})
            .populate('productId')
        }else{
          next({httpStatus: 403, message: data.productId.name+'`s stock is not enough'})
        }
      })
      .then(data => {
        // if(!data) next({httpStatus: 404, message: 'Cart not found'});
        cartData = data;
        return Model.Product
          .findByIdAndUpdate(data.productId._id,{
            $inc: { stock: -1*data.quantity }
          })
        })
      .then(data => {
        res.json(cartData);
      })
      .catch(next)
  }
  static showCheckout(req,res,next){
    Model.Cart
      .find({
        status: 'checkout',
        userId: req.decode._id,
      })
      .populate('productId')
      .then(data => {
        res.json(data);
      })
      .catch(next)
  }
  static payment(req,res,next){
    Model.Cart
      .findByIdAndUpdate(req.params.id, {
        status: 'paid',
      })
      .then(data => {
        res.json(data);
      })
      .catch(next);
  }
  static remove(req,res,next){
    Model.Cart
      .deleteOne({
        _id: req.params.id,
      })
      .then(data => {
        if(data.deletedCount === 0) next({httpStatus: 404, message: 'Cart not found'});
        res.json({delete: data.deletedCount, message: 'Successfully delete Product'});
      })
      .catch(next)
  }
  static history(req,res,next){
    Model.Cart
      .find({
        userId: req.decode._id,
        status: 'paid',
      })
      .populate('productId')
      .sort([['updatedAt', -1]])
      .then(data => {
        console.log(data)
        res.json(data)
      })
      .catch(next)
  }
}

module.exports = Cart;