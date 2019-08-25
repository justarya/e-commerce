let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let app = require('../app.js');
let Model = require('../models');

chai.use(chaiHttp);

describe("Costumer Authentication", () => {
  after(function(){
    Model.User
      .deleteMany()
      .then(data => {
        console.log('SUCCESS')
      })
  })
  describe("Register | POST /api/user/register", () => {
    it('It should return Token and Payload with status 201', (done)=> {
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
          expect(res).to.have.status(201);
          expect(res.body.access_token).to.be.a('string');
          expect(res.body.payload).to.include.all.keys('_id','name','email','role','loginWith');
          expect(res.body.payload.name).to.have.string(user.name);
          expect(res.body.payload.username).to.have.string(user.username);
          expect(res.body.payload.email).to.have.string(user.email);
          expect(res.body.payload.role).to.have.string('customer');
          expect(res.body.payload.loginWith).to.have.string('normal');
          
          done();
        })
    });

    it('It should return error username already been taken', (done)=> {
      let user = {
        name: 'test1',
        username: 'test1',
        password: 'testtest1234',
        email: 'test2@mail.com'
      }
      chai
        .request(app)
        .post('/api/user/register')
        .send(user)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.be.an('array').to.include('Username has already been taken');
          
          done();
        })
    });

    it('It should return error email already been taken', (done)=> {
      let user = {
        name: 'test1',
        username: 'test12',
        password: 'testtest1234',
        email: 'test1@mail.com'
      }
      chai
        .request(app)
        .post('/api/user/register')
        .send(user)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.be.an('array').to.include('Email has already been taken');

          done();
        })
    });

    it('It should return email validation error', (done)=> {
      let user = {
        name: 'test2',
        username: 'test2',
        password: 'testtest1234',
        email: 'test2.com'
      }
      chai
        .request(app)
        .post('/api/user/register')
        .send(user)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.be.an('array').to.include(user.email+' is not a valid email');
          
          done();
        })
    });

  })

  describe("LOGIN | POST /api/user/login", function(){
    it('It should return Token and Payload with status 200', (done)=> {
      let user = {
        name: 'test1',
        username: 'test1',
        password: 'testtest1234',
        email: 'test1@mail.com'
      }
      let userInput = {};
      userInput.email = user.email;
      userInput.password = user.password;
  
      chai
        .request(app)
        .post('/api/user/login')
        .send(userInput)
        .end((err,res) => {
          expect(res.body.access_token).to.be.a('string');
          expect(res.body.payload).to.include.all.keys('_id','role','loginWith');
          expect(res.body.payload.name).to.equal(user.name);
          expect(res.body.payload.username).to.equal(user.username);
          expect(res.body.payload.email).to.equal(user.email);
  
          done();
        })
    });
    it('It should return Error contains Email/Password is wrong', (done)=> {
      let user = {
        name: 'test1',
        username: 'test1',
        password: 'testtest12345678',
        email: 'test1@mail.com'
      }
      let userInput = {};
      userInput.email = user.email;
      userInput.password = user.password;
  
      chai
        .request(app)
        .post('/api/user/login')
        .send(userInput)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.equal('Email/Password is wrong');

          done();
        })
    });
    it('It should return Error contains Email/Password is wrong', (done)=> {
      let user = {
        name: 'test1',
        username: 'test1',
        password: 'testtest1234',
        email: 'test1234@mail.com'
      }
      let userInput = {};
      userInput.email = user.email;
      userInput.password = user.password;
  
      chai
        .request(app)
        .post('/api/user/login')
        .send(userInput)
        .end((err,res) => {
          expect(res).to.have.status(403);
          expect(res.body.error).to.equal('Email/Password is wrong');

          done();
        })
    });
    it('It should return Error contains Email/Password is required', (done)=> {
      let user = {
        name: 'test1',
        username: 'test1234',
        password: 'testtest1234',
        email: ''
      }
      let userInput = {};
      userInput.email = user.email;
      userInput.password = user.password;
  
      chai
        .request(app)
        .post('/api/user/login')
        .send(userInput)
        .end((err,res) => {
          expect(res).to.have.status(406);
          expect(res.body.error).to.equal('Email/Password is required');

          done();
        })
    });
    it('It should return Error contains Email/Password is required', (done)=> {
      let user = {
        name: 'test1',
        username: 'test1234',
        password: '',
        email: 'test1@mail.com'
      }
      let userInput = {};
      userInput.email = user.email;
      userInput.password = user.password;
  
      chai
        .request(app)
        .post('/api/user/login')
        .send(userInput)
        .end((err,res) => {
          expect(res).to.have.status(406);
          expect(res.body.error).to.equal('Email/Password is required');

          done();
        })
    });
  })
});