var ledger = require('../lib/ledger'),
  balance = require('../lib/balance'),
  Ledger = ledger.Ledger,
  Balance = balance.Balance;

describe('Balance', function() {
  beforeEach(function() {
    ledger = new Ledger({file: 'spec/data/single-transaction.dat'});
  });
  
  it("should return two accounts", function(done) {
    var spec = this;
    ledger.balance(function(err, balance) {
      if (err) return spec.fail(err);
      done();      
    });
  });
});