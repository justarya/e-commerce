let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let app = require('../app.js');
let Model = require('../models');

chai.use(chaiHttp);


describe("Products", () => {
  let access_token;
  let email;
  let productId;

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
          email = res.body.payload.email;

          Model.User
            .updateOne({
              email
            },{
              role: 'seller'
            })
            .then(data => {
              console.log(data);
              console.log('Sukses jadi seller!');
              done();
            })
        })
        
  });

  after(function(){
    Model.Product
      .deleteMany()
      .then(data => {
        console.log('SUCCESS')
      })
    Model.User
      .deleteMany()
      .then(data => {
        console.log('SUCCESS')
      })
  })
  
  describe("Create Product | POST /api/products", () => {
    it('It should create product and return Object', (done)=> {
      let product = {
        name: 'Macbook Pro 2019',
        description: 'Ini makbuk kelen laa',
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
          expect(res).to.have.status(201);
          expect(res.body).to.include.all.keys('_id','name','price','stock','category','sellerId','createdAt','updatedAt');
          expect(res.body.name).to.be.a('string');
          expect(res.body.price).to.be.a('number');
          expect(res.body.stock).to.be.a('number');
          expect(res.body.category).to.be.an('array').to.include.members(product.category);
          expect(new Date(res.body.createdAt)).to.be.a('date');
          expect(new Date(res.body.updatedAt)).to.be.a('date');
          
          done();
        })
    });

    it('It should return error Product name cannot be empty', (done)=> {
      let product = {
        name: '',
        price: 20000000,
        description: 'Ini makbuk kelen laa',
        stock: 10,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .post('/api/products')
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(403)
          expect(res.body.error).to.be.an('array').to.include('Product name cannot be empty');
          
          done();
        })
    });

    it('It should return error Product price cannot be less than 0', (done)=> {
      let product = {
        name: 'Macbook Pro 2019',
        price: -1,
        description: 'Ini makbuk kelen laa',
        stock: 10,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .post('/api/products')
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(403)
          expect(res.body.error).to.be.an('array').to.include('Product Price cannot be less than 0');
          
          done();
        })
    });

    it('It should return error Product stock cannot be less than 0', (done)=> {
      let product = {
        name: 'Macbook Pro 2019',
        price: 10000000,
        description: 'Ini makbuk kelen laa',
        stock: -2,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .post('/api/products')
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(403)
          expect(res.body.error).to.be.an('array').to.include('Product Stock cannot be less than 0');
          
          done();
        })
    });

    // it('It should return error Product Category must be an array', (done)=> {
    //   let product = {
    //     name: 'Macbook Pro 2019',
    //     price: 10000000,
    //     stock: 10,
    //     category: "acds"
    //   }
    //   chai
    //     .request(app)
    //     .post('/api/products')
    //     .set('access_token',access_token)
    //     .send(product)
    //     .end((err,res) => {
    //       expect(res).to.have.status(403)
    //       expect(res.body.error).to.be.an('array').to.include('Product Category must be an array');
          
    //       done();
    //     })
    // });
  })
  describe("Edit Product | PUT /api/products/:id", () => {
    it('It should update product and return Object', (done)=> {
      let product = {
        name: 'Macbook Pro 2020',
        price: 20000000,
        stock: 10,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .put(`/api/products/${productId}`)
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.all.keys('_id','name','price','stock','category','sellerId','createdAt','updatedAt');
          expect(res.body.name).to.be.a('string').to.equal(product.name);
          expect(res.body.price).to.be.a('number').to.equal(product.price);
          expect(res.body.stock).to.be.a('number').to.equal(product.stock);
          expect(res.body.category).to.be.an('array').to.include.members(product.category);
          expect(new Date(res.body.createdAt)).to.be.a('date');
          expect(new Date(res.body.updatedAt)).to.be.a('date');
          
          done();
        })
    });

    it('It should return error Product name cannot be empty', (done)=> {
      let product = {
        name: '',
        price: 20000000,
        stock: 10,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .put('/api/products/'+productId)
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(403)
          expect(res.body.error).to.be.an('array').to.include('Product name cannot be empty');
          
          done();
        })
    });

    it('It should return error Product price cannot be less than 0', (done)=> {
      let product = {
        name: 'Macbook Pro 2019',
        price: -1,
        stock: 10,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .put('/api/products/'+productId)
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(403)
          expect(res.body.error).to.be.an('array').to.include('Product Price cannot be less than 0');
          
          done();
        })
    });

    it('It should return error Product stock cannot be less than 0', (done)=> {
      let product = {
        name: 'Macbook Pro 2019',
        price: 10000000,
        stock: -2,
        category: ['Laptop','Gadget','Apple']
      }
      chai
        .request(app)
        .put('/api/products/'+productId)
        .set('access_token',access_token)
        .send(product)
        .end((err,res) => {
          expect(res).to.have.status(403)
          expect(res.body.error).to.be.an('array').to.include('Product Stock cannot be less than 0');
          
          done();
        })
    });
  });
  describe("Find All Products | GET /api/products/:id", () => {
    it('It should return results of products in array of object', (done)=> {
      chai
        .request(app)
        .get('/api/products')
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.include.all.keys('_id','name','price','stock','category','sellerId','createdAt','updatedAt');
          expect(res.body[0].name).to.be.a('string');
          expect(res.body[0].price).to.be.a('number');
          expect(res.body[0].stock).to.be.a('number');
          expect(res.body[0].category).to.be.an('array');
          expect(new Date(res.body[0].createdAt)).to.be.a('date');
          expect(new Date(res.body[0].updatedAt)).to.be.a('date');
          
          done();
        })
    });
  });
  describe("Search Products | GET /api/products?search=macbook", () => {
    it('It should return results of search products in array of object', (done)=> {
      chai
        .request(app)
        .get(`/api/products?search=macbook`)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.include.all.keys('_id','name','price','stock','category','sellerId','createdAt','updatedAt');
          expect(res.body[0].name).to.be.a('string');
          expect(res.body[0].price).to.be.a('number');
          expect(res.body[0].stock).to.be.a('number');
          expect(res.body[0].category).to.be.an('array');
          expect(new Date(res.body[0].createdAt)).to.be.a('date');
          expect(new Date(res.body[0].updatedAt)).to.be.a('date');
          
          done();
        })
    });
  });
  describe("Find One Product | GET /api/products/:id", () => {
    it('It should return result one product', (done)=> {
      console.log('/api/products/'+productId)
      chai
        .request(app)
        .get(`/api/products/${productId}`)
        .end((err,res) => {
          expect(res).to.have.status(200);
          // expect(res.body).to.be.an('array');
          expect(res.body).to.include.all.keys('_id','name','price','stock','category','sellerId','createdAt','updatedAt');
          expect(res.body.name).to.be.a('string');
          expect(res.body.price).to.be.a('number');
          expect(res.body.stock).to.be.a('number');
          expect(res.body.category).to.be.an('array');
          expect(new Date(res.body.createdAt)).to.be.a('date');
          expect(new Date(res.body.updatedAt)).to.be.a('date');
          
          done();
        })
    });
  });
  describe("Delete Product | GET /api/products/:id", () => {
    it('It should return success delete product', (done)=> {
      chai
        .request(app)
        .delete('/api/products/'+productId)
        .set('access_token',access_token)
        .end((err,res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Successfully delete product')
          
          done();
        })
    });
  });
});