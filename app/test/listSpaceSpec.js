process.env.NODE_ENV = "test";
environment = 'test';

const monk = require('monk');
const Browser = require('zombie');
const app = require('../app');
const http = require('http');

describe('Listing Spaces', function() {

  before(function() {
    this.server = http.createServer(app).listen(3000);
    this.browser = new Browser({site: 'http://localhost:3000'});
  });

  describe('New Space', function() {

    before(function(done) {
      this.browser.visit('/spaces/new', done);
    });

    before(function(done) {
      this.browser
        .fill('spacename', 'Cozy loft')
        .fill('description', 'So cozy')
        .fill('price_per_night', '3000')
        .fill('available_from', '01/01/17')
        .fill('available_to', '01/01/18')
        .pressButton('List my Space', done);
    });

    it('after submit redirects to -book a space- page', function() {
      this.browser.assert.url({ pathname: '/spaces' });
    });

    xit('displays the newly entered space title and description', function(){
      this.browser.assert.text('li:nth-child(1)', 'Cozy loft So cozy');
    });

    describe('second space', function(){

      before(function(done) {
        this.browser.visit('/spaces/new', done);
      });

      before(function(done) {
        this.browser
          .fill('spacename', 'Cozy loft')
          .fill('description', 'Super cozy')
          .fill('price_per_night', '3000')
          .fill('available_from', '01/01/17')
          .fill('available_to', '01/01/18')
          .pressButton('List my Space', done);
      });

      it('redirects back to the create space page', function(){
        this.browser.assert.url({ pathname: "/spaces/new"});
      });


    });
  });

  after(function(done){
    monk('localhost:27017/makersbnb' + environment)
      .get('spaces')
      .drop(function(err) {
        if(err) throw err;
        done();
      });
  });

  after(function(done){
    this.server.close(done());
  });
});
