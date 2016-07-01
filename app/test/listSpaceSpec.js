process.env.NODE_ENV = "test";

const Browser = require('zombie');
const http = require('http');
const app = require('../app');

describe('Listing Spaces', function() {

  before(function(done) {
    this.timeout(15000);
    this.server = http.createServer(app).listen(3000);
    this.browser = new Browser({site: 'http://localhost:3000'});
    this.browser.visit('/spaces/new', done);
  });

  describe('New Space', function() {

    before(function(done) {
      this.browser
        .fill('spacename', 'Cozy loft')
        .fill('description', 'So cozy!')
        .fill('price_per_night', '3000')
        .fill('available_from', '01/01/17')
        .fill('available_to', '01/01/18')
        .pressButton('List my Space', done);
    });

    it('after submit redirects to -book a space- page', function() {
      this.browser.assert.url({ pathname: '/spaces' });
    });

    xit('displays the newly entered space title and description', function(){
      this.browser.assert.text('#container:nth-child(1)', 'Cozy loft So cozy');
    });

  });

  after(function(done){
      this.server.close(done);
    });
});
