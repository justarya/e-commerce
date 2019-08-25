const Model = require('../models');

class Product {
  static findAll(req,res,next){
    let whereData = {};
    if(req.query.search) whereData.name = {$regex: new RegExp(`${req.query.search}`,'i')};
    Model.Product
      .find(whereData)
      .then((data) => {
        res.json(data);
      })
      .catch(next);
  }

  static findOne(req,res,next){
    Model.Product
      .findOne({
        _id: req.params.id
      })
      .then(data => {
        if(!data) next({httpStatus: 404, message: 'Product not found'})
        res.json(data);
      })
  }
  
  static create(req,res,next){
    let thumbnail;
    if (req.file && req.file.gcsUrl) {
      thumbnail = req.file.gcsUrl;
    }

    Model.User
      .findById(req.decode._id)
      .then(user => {
        console.log(user);
        if(user.role === 'seller'){
          Model.Product
            .create({
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              stock: req.body.stock,
              category: req.body.category,
              thumbnail,
              sellerId: req.decode._id,
            })
            .then(data => {
              res.status(201).json(data);
            })
            .catch(next);
        }else{
          next({httpStatus:401,message:'You are not a seller'})
        }
      })
  }

  static edit(req,res,next){
    Model.Product
      .findOneAndUpdate({
        _id: req.params.id,
      },{
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category
      },{
        new: true,
        runValidators: true,
      })
      .then(data => {
        if(!data) next({httpStatus: 404, message: 'Product not found'})
        res.json(data);
      })
      .catch(next);
  }
  static remove(req,res,next){
    Model.Product
      .deleteOne({
        _id: req.params.id,
      })
      .then(data => {
        if(!data) next({httpStatus: 404, message: 'Product not found'})
        res.json({message:'Successfully delete product'})
      })
  }
}

module.exports = Product;