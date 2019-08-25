let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let app = require('../app.js');
let Model = require('../models');

let access_token;
let cartId;
let productId;

chai.use(chaiHttp);

describe("CART",function(){

  before(function(done){
    let user = {
      name: 'test1',
      username: 'test1',
      password: 'testtest1234',
      email: 'test1@mail.com'
    }
    chai
      .request(app)
      .post('/api/user/register')
      .send(user)
      .end(function(err,res){
        access_token = res.body.access_token;
        Model.User
          .findByIdAndUpdate(res.body.payload._id,{
            role: 'seller'
          },{new: true})
          .then(data => {
            let product = {
              name: 'Macbook Pro 2019',
              description: 'Lorem ipsum sdfasfdsdlfksfsdf',
              price: 20000000,
              stock: 10,
              category: ['Laptop','Gadget','Apple']
            }
            chai
              .request(app)
              .post('/api/products')
              .set('access_token',access_token)
              .send(product)
              .end((err,res) => {
                productId = res.body._id;
                console.log(res.body)
                done();
              });
          })
      });
  });

  after(function(){
    Model.Cart
      .deleteMany()
      .then(() => {
        console.log('success delete cart');
      })
    
    Model.User
      .deleteMany()
      .then(() => {
        console.log('sucess delete User')
      })
  });

  describe("Create Cart | POST /api/cart/", function(){
    it('It should return object', function(done){
      let cart = {
        productId,
        quantity: 2,
      }
      chai
        .request(app)
        .post('/api/cart')
        .set('access_token',access_token)
        .send(cart)
        .end((err,res) => {
          cartId = res.body._id;
          expect(res).to.have.status(201);
          expect(res.body).to.have.all.keys('_id','productId','status','userId','quantity','createdAt','updatedAt');
          expect(res.body.status).to.be.a('string');
          expect(res.body.quantity).to.be.a('number');
          expect(new Date(res.body.createdAt)).to.be.a('date');
          expect(new Date(res.body.updatedAt)).to.be.a('date');
          done();
        })
    })
    it('It should return error ProductId is required', function(done){
      let cart = {
        quantity: 1,
      }
      chai
        .request(app)
        .post('/api/cart')
        .set('access_token',access_token)
        .send(cart)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.be.an('array').to.include('Product Id cannot be empty');
          done();
        })

    })
    it('It should return error Quantity is required', function(done){
      let cart = {
        productId
      }
      chai
        .request(app)
        .post('/api/cart')
        .set('access_token',access_token)
        .send(cart)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.be.an('array').to.include('Quantity cannot be empty');
          done();
        })

    })
  })
  describe("Edit Cart | POST /api/cart/", function(){
    it('It should return object', function(done){
      let cart = {
        productId,
        quantity: 2,
      }
      chai
        .request(app)
        .patch('/api/cart/'+cartId)
        .set('access_token',access_token)
        .send(cart)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('_id','productId','status','userId','quantity','createdAt','updatedAt');
          expect(res.body.status).to.be.a('string');
          expect(res.body.quantity).to.be.a('number');
          expect(new Date(res.body.createdAt)).to.be.a('date');
          expect(new Date(res.body.updatedAt)).to.be.a('date');
          done();
        })
    })
    it('It should return error Quantity is required', function(done){
      let cart = {
        productId
      }
      chai
        .request(app)
        .patch('/api/cart/'+cartId)
        .set('access_token',access_token)
        .send(cart)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.be.an('array').to.include('Quantity cannot be empty');
          done();
        })

    })
  })
  describe("Checkout Cart | POST /api/cart/", function(){
    it('It should return object', function(done){
      chai
        .request(app)
        .patch('/api/cart/'+cartId+'/checkout')
        .set('access_token',access_token)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.all.keys('_id','productId','status','userId','quantity','createdAt','updatedAt');
          expect(res.body.status).to.be.a('string');
          expect(res.body.quantity).to.be.a('number');
          expect(new Date(res.body.createdAt)).to.be.a('date');
          expect(new Date(res.body.updatedAt)).to.be.a('date');
          done();
        })
    })
    it('It should return error 404 Cart not found', function(done){
      chai
        .request(app)        
        .patch('/api/cart/5d5b8519961ea41eeee9df67/checkout')   
        .set('access_token',access_token)
        .end((err,res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Cart not found');
          done();
        })
    })
  })
  describe("Delete Cart | DELETE /api/cart/", function(){
    it('It should return error 404 Cart not found', function(done){
      chai
        .request(app)        
        .delete('/api/cart/5d5b8519961ea41eeee9df67')
        .set('access_token',access_token)
        .end((err,res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Cart not found');
          done();
        })
    })
    it('It should delete cart and return message', function(done){
      chai
        .request(app)
        .delete('/api/cart/'+cartId)
        .set('access_token',access_token)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body.delete).to.equal(1);
          expect(res.body.message).to.equal('Successfully delete Product');
          done();
        })
    })
  })
})