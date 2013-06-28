/*global require, describe, beforeEach, it, expect */
var ledger = require('../lib/ledger'),
    Ledger = ledger.Ledger;

describe('Ledger', function() {
  var ledger, spec;
  
  beforeEach(function() {
    ledger = new Ledger();
    spec = this;
  });
  
  it("should return installed ledger-cli version", function(done) {
    ledger.version(function(err, version) {
      if (err) { return spec.fail(err); }
      
      expect(version).toBe('3.0.0-20120518');
      done();
    });
  });
});