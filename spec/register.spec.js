var ledger = require('../lib/ledger'),
  Ledger = ledger.Ledger,
  toBePosting = require('./matchers/posting-matcher').toBePosting;
  
describe('Register', function() {
  var spec;
  
  beforeEach(function() {
    spec = this;
    spec.addMatchers({ toBePosting: toBePosting });
  });
  
  describe('single transaction', function() {
    var ledger, balances;
    
    beforeEach(function(done) {
      ledger = new Ledger({file: 'spec/data/single-transaction.dat'}),
      entries = [];
      
      ledger.register()
        .on('data', function(entry) {
          entries.push(entry);
        })
        .once('end', function(){
          done();
        })
        .on('error', function(error) {
          spec.fail(error);
          done();
        });
    });

    it("should return entry for single transaction", function() {
      expect(entries.length).toBe(1);
    });

    it("should parse transaction", function() {
      var transaction = entries[0];
      expect(transaction.date).toEqual(new Date(2013, 3, 19));
      expect(transaction.payee).toBe('My Employer');
    });

    it("should parse the first posting", function() {
      var posting = entries[0].postings[0];
      expect(posting).toBePosting({ 
        amount: '£1,000.00', 
        account: 'Assets:Checking'
      });
    });
    
    it("should parse the second posting", function() {
      var posting = entries[0].postings[1];
      expect(posting).toBePosting({ 
        amount: '£-1,000.00', 
        account: 'Income:Salary'
      });
    });    
  });
});