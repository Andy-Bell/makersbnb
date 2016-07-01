process.env.NODE_ENV = "test";
environment = 'test';

const monk = require('monk');
const Browser = require('zombie');
const app = require('../app');
const http = require('http');
var assert = require('assert');

describe("Sign Up Functionality", function(){

  before(function(){
    this.server = http.createServer(app).listen(3000);
    this.browser= new Browser({site: 'http://localhost:3000'});
  });

  describe("checks the page",function(){

    before(function(done){
      this.browser.visit('/users/new', done);
    });

    it("expects welcome message", function(){
      this.browser.assert.text('#form-head', 'Please enter your details');
    });

    it("expect a form", function(){
      this.browser.assert.attribute('form', 'method', 'post');
      this.browser.assert.attribute('form', 'action', '/users/new');
      this.browser.assert.element('#username');
      this.browser.assert.element('#fullName');
      this.browser.assert.element('#email');
      this.browser.assert.element('button');
      this.browser.assert.attribute('button', 'value', 'submit');
    });
  });

  describe("expect a successful submission", function(){

    before(function(done){
      this.browser.visit('/users/new', done);
    });

    before(function(done){
      this.browser
        .fill('username', 'tester')
        .fill('fullName', 'Test')
        .fill('email', 'test@test.com')
        .pressButton('submit', done);
    });

    it('is successful', function(){
      this.browser.assert.success();
    });

    it('presents welcome page', function(){
      this.browser.assert.text('#email', 'test@test.com');
      this.browser.assert.text('#fullName', 'Test');
      this.browser.assert.text('#username', 'tester');
    });

    describe('test multiple data entries', function() {

      before(function(done){
        this.browser.visit('/users/new', done);
      });

      before(function(done){
        this.browser
          .fill('email', 'lil@lol.com')
          .fill('fullName', 'gigi')
          .fill('username', 'tester')
          .pressButton('submit', done);
      });

      it('redirects back to the create users page', function(){
        this.browser.assert.url({ pathname: "/users/new"});
      });

    });
  });

  after(function(done){
    monk('localhost:27017/makersbnb' + environment)
      .get('users')
      .drop(function(err) {
        if(err) throw err;
        done();
      });
  });

  after(function(done){
    this.server.close(done());
  });

});
