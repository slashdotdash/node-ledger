var Ledger = require('../lib/ledger').Ledger;

describe('Accounts', function() {
  var spec;
  
  beforeEach(function() {
    spec = this;
  });
  
  describe('single transaction, multiple accounts', function() {
    var ledger, accounts;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/single-transaction.dat'});
      accounts = [];

      ledger.accounts()
        .on('data', function(account) {
          accounts.push(account);
        })
        .once('end', function(){
          done();
        })
        .on('error', function(error) {
          spec.fail(error);
          done();
        });
    });

    it('should return two accounts', function() {
      expect(accounts.length).toBe(2);
    });

    it('should return accounts listed alphabetically', function() {
      expect(accounts).toEqual([
        'Assets:Checking',
        'Income:Salary'
      ]);
    });
  });
});