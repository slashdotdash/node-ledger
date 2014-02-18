var chai = require('chai'),
    expect = chai.expect,
    Ledger = require('../lib/ledger').Ledger;

describe('Ledger', function() {
  var ledger, spec;
  
  beforeEach(function() {
    ledger = new Ledger();
    spec = this;
  });
  
  it('should return installed ledger-cli version', function(done) {
    ledger.version(function(err, version) {
      if (err) { return spec.fail(err); }
      
      expect(version.substr(0, 5)).to.equal('3.0.0');
      done();
    });
  });
});